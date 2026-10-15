const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const source = fs.readFileSync(path.join(__dirname, '../js/scroll-video.js'), 'utf8')
    .replace('export function', 'function');

function setup({src = 'portrait.mp4', reduced = false, saveData = false} = {}) {
    function events(props = {}) {
        const listeners = {};
        return Object.assign(props, {
            addEventListener(name, fn) {(listeners[name] ??= []).push(fn);},
            emit(name) {for (const fn of listeners[name] ?? []) fn();},
        });
    }
    let loads = 0;
    let nextFrame = 0;
    const frames = new Map();
    const classes = new Set();
    const video = events({dataset: {videoSrc: src}, duration: 10, currentTime: 0,
        seeking: false, pause() {}, load() {loads++;}});
    const stage = {classList: {add: v => classes.add(v), remove: v => classes.delete(v)}};
    const button = events({hidden: true, setAttribute() {}});
    const preference = events({matches: reduced});
    const connection = events({saveData});
    const document = events({hidden: false, body: {}, documentElement: {scrollHeight: 2000},
        querySelector: s => ({'[data-scroll-video]': video, '[data-scroll-video-stage]': stage,
            '[data-video-motion]': button})[s]});
    const window = events({innerHeight: 1000, scrollY: 0, matchMedia: () => preference,
        requestAnimationFrame(fn) {frames.set(++nextFrame, fn); return nextFrame;},
        cancelAnimationFrame(id) {frames.delete(id);}});
    vm.runInNewContext(source + '\ninitScrollVideo();', {document, window, navigator: {connection}});
    return {video, button, window, classes, document, get loads() {return loads;},
        flush() {const batch = [...frames.values()]; frames.clear(); batch.forEach(fn => fn());},
        ready() {video.emit('loadeddata'); this.flush();},
        scroll(y) {window.scrollY = y; window.emit('scroll'); this.flush();}};
}

test('no source keeps poster without requesting media', () => {
    const s = setup({src: ''});
    assert.equal(s.loads, 0);
    assert.equal(s.button.hidden, true);
});

test('scroll maps forward and backward, clamped to video bounds', () => {
    const s = setup(); s.ready();
    s.scroll(500); assert.ok(Math.abs(s.video.currentTime - 4.9833) < .001);
    s.scroll(200); assert.ok(s.video.currentTime < 2);
    s.scroll(-100); assert.equal(s.video.currentTime, 0);
    s.scroll(3000); assert.ok(s.video.currentTime < 10 && s.video.currentTime > 9.9);
});

test('an in-flight seek catches up to latest scroll on completion', () => {
    const s = setup(); s.ready(); s.video.seeking = true;
    s.scroll(200); s.scroll(800); assert.equal(s.video.currentTime, 0);
    s.video.seeking = false; s.video.emit('seeked'); s.flush();
    assert.ok(s.video.currentTime > 7.9);
});

test('reduced motion and data saver defer downloading until opt-in', () => {
    for (const options of [{reduced: true}, {saveData: true}]) {
        const s = setup(options); assert.equal(s.loads, 0);
        s.button.emit('click'); assert.equal(s.loads, 1);
        s.ready(); s.scroll(500); const time = s.video.currentTime;
        s.button.emit('click'); s.scroll(900); assert.equal(s.video.currentTime, time);
    }
});

test('media failure restores poster and hides motion control', () => {
    const s = setup(); s.ready(); assert.ok(s.classes.has('is-ready'));
    s.video.emit('error'); assert.equal(s.classes.has('is-ready'), false);
    assert.equal(s.button.hidden, true);
});

test('restored scroll position is applied when media becomes ready', () => {
    const s = setup(); s.scroll(700); assert.equal(s.video.currentTime, 0);
    s.ready(); assert.ok(s.video.currentTime > 6.9);
});
