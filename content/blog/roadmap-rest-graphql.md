---
title: API: REST، GraphQL و دریافت داده
description: API: REST، GraphQL و دریافت داده؛ آموزش مسیر فرانت‌اند به زبان ساده، همراه با مثال و خروجی.
date: 2026-11-06
category: مسیر فرانت‌اند
order: 22
---

## REST
معماری مبتنی بر **منابع** و متدهای HTTP ([HTTP](/blog/roadmap-internet-http-dns-hosting/)).

| عملیات | درخواست |
|---|---|
| لیست | `GET /users?page=2&limit=20&sort=name` |
| یک مورد | `GET /users/5` |
| ساخت | `POST /users` |
| جایگزینی | `PUT /users/5` |
| تغییر جزئی | `PATCH /users/5` |
| حذف | `DELETE /users/5` |

- نام منابع **اسم جمع**، سلسله‌مراتب `/users/5/posts`.
- پاسخ JSON + status code درست (`201` برای ساخت، `204` بدون بدنه، `404`، `422`).
- **صفحه‌بندی**: offset/limit یا cursor (`?cursor=abc`).
- نسخه‌بندی: `/v1/users` یا هدر.
- **HATEOAS** (لینک‌ها در پاسخ) در عمل کمتر رعایت می‌شود.
- مستندسازی: **OpenAPI/Swagger**؛ تولید نوع TS از آن (`openapi-typescript`).

### کلاینت fetch
```ts
async function http<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, { headers: { "Content-Type": "application/json" }, ...init });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.status === 204 ? (undefined as T) : res.json();
}
const users = await http<User[]>("/api/users");
```
Axios جایگزین محبوب با interceptor؛ ولی `fetch` بومی معمولاً کافی است. ([Fetch](/blog/roadmap-web-apis/))

## مدیریت state سرور: TanStack Query
```tsx
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

function Users() {
  const { data, isPending, error } = useQuery({
    queryKey: ["users"],
    queryFn: () => http<User[]>("/api/users"),
    staleTime: 60_000,
  });
  const qc = useQueryClient();
  const add = useMutation({
    mutationFn: (u: NewUser) => http("/api/users", { method: "POST", body: JSON.stringify(u) }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["users"] }),
  });
  if (isPending) return <p>…</p>;
  if (error) return <p>خطا</p>;
  return <ul>{data.map(u => <li key={u.id}>{u.name}</li>)}</ul>;
}
```
مزایا: cache، dedupe، retry، refetch خودکار، optimistic update، pagination/infinite. معادل در Vue/Svelte/Angular هم هست. جایگزین: SWR.

## GraphQL
زبان کوئری که **کلاینت دقیقاً مشخص می‌کند چه فیلدهایی** را می‌خواهد؛ یک endpoint (`POST /graphql`).

### Schema (سمت سرور)
```graphql
type User { id: ID!  name: String!  posts: [Post!]! }
type Post { id: ID!  title: String!  author: User! }

type Query {
  user(id: ID!): User
  users(limit: Int = 10): [User!]!
}
type Mutation {
  createUser(name: String!): User!
}
type Subscription { postAdded: Post! }    # بلادرنگ
```
`!` یعنی non-null.

### Query و Mutation
```graphql
query GetUser($id: ID!) {
  user(id: $id) {
    id
    name
    posts { title }
  }
}

mutation { createUser(name: "Ali") { id name } }
```
```js
const res = await fetch("/graphql", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ query, variables: { id: "5" } }),
});
const { data, errors } = await res.json();    // خطا ممکنه با status 200 بیاد
```

### REST در مقابل GraphQL
| | REST | GraphQL |
|---|---|---|
| Over/under-fetching | ممکن | حل شده |
| چند منبع در یک درخواست | چند درخواست | یک درخواست |
| cache HTTP | آسان | پیچیده‌تر |
| یادگیری/سرور | ساده | بیشتر |
| نوع‌بندی | اختیاری (OpenAPI) | ذاتی (Schema) |

### کلاینت‌ها
- **Apollo Client**: cache نرمال‌شده، hooks، devtools
- **Relay**: (Meta) سخت‌گیر و پرکارایی، fragment colocation
- **urql**، `graphql-request`
```tsx
import { useQuery, gql } from "@apollo/client";
const Q = gql`query { users { id name } }`;
function Users() {
  const { data, loading, error } = useQuery(Q);
  /* ... */
}
```
- **GraphQL Code Generator**: تولید نوع TS از schema/query.
- مشکل N+1 در سرور ← DataLoader؛ امنیت: محدودیت عمق/پیچیدگی.

## سایر روش‌ها
- **tRPC**: فراخوانی نوع‌دار بدون schema جدا (TS تا TS)
- **WebSocket / SSE** برای بلادرنگ
- **gRPC-web**، **JSON:API**
- **BFF** (Backend for Frontend): لایه‌ای اختصاصی برای هر کلاینت

## مدیریت خطا و تجربه‌ی کاربری
- حالت‌های **loading / error / empty / success** را همیشه طراحی کن.
- Retry با backoff، timeout (`AbortSignal.timeout`)
- Optimistic UI
- اعتبارسنجی پاسخ با Zod ([TS پیشرفته](/blog/roadmap-typescript-advanced/))
- Rate limit (`429`) و هدر `Retry-After`

## ابزار تست API
Postman / Insomnia / Bruno / `curl` / REST Client در VS Code؛ mock: MSW، JSON Server.

```bash
curl -X POST https://api.example.com/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Ali"}'
```

## تمرین
۱. از یک API عمومی (مثلاً JSONPlaceholder) لیست پست‌ها را با TanStack Query نمایش بده، با صفحه‌بندی.
۲. با یک API عمومی GraphQL (مثل Countries API) یک کوئری بزن و فقط دو فیلد بگیر.
۳. حالت‌های loading/error را شبیه‌سازی کن.
