<div align="center">
  <a href="https://sipk.fun/">
    <img src="public/logo_fill.png" alt="Logo" width="100" height="100">
  </a>
  
  <h3 align="center">SIPK App</h3>
</div>

## API

### API Scope Roles

- **Public Role**:  
  API endpoints accessible to the public.

- **Authenticated Users Role**:  
  API endpoints accessible only to valid users. A valid user is determined by verifying the `Authorization` header and the `_Secure-auth.session-token` cookie. Both values must meet the following requirements:
  - `Authorization`: Must be a **'Bearer'** token containing the user's access token retrieved from Supabase.
  - `_Secure-auth.session-token`: Must be a session token retrieved from Supabase and **encrypted** by SIPK.

    > If both values are valid, the request is granted as **Valid Users**. Otherwise, the API responds with an `AuthError`, which could be one of the following codes: `AUTH_00`, `AUTH_01`, `AUTH_02`, `AUTH_03`, or `AUTH_04`.

- **Service Role**:  
  API endpoints accessible only to services. A valid service is determined by verifying the `apiKey` URL parameter or the `x-api-key` header. At least one of these values must meet the following requirements:
  - `apiKey`: Must be a valid Supabase service role key.
  - `x-api-key`: Must be a valid Supabase service role key.

    > If either value is valid, the request is granted as **Service**. Otherwise, the API responds with an `AuthError` specifically `AUTH_05`.

- **Authenticated Users and Service Role**:  
  API endpoints accessible to both authenticated users and services. The API first checks if the request can be authorized as a service. If not, it then verifies whether the request can be authorized as a valid user.

### API Endpoints

| Endpoint                 | Method | Description                                       | [Scope](https://github.com/rheyhannh/sipk-app/edit/origin/stable/README.md#api-scope-roles) | Slug       |
|--------------------------|--------|---------------------------------------------------|---------------------------------------------------------------------------------------------|------------|
| `/auth/check`            | GET    | Revalidate user session                          | Public                      | `AUTH_CHECK` |
| `/auth/confirm/login`    | GET    | Verify user's magic link token for login         | Public                      | `AUTH_CONFIRM` |
| `/auth/confirm/signup`   | GET    | Verify user's registration token for signup      | Public                      | `AUTH_CONFIRM` |
| `/auth/reset`            | GET    | Reset user session and access token              | Public                      | `AUTH_RESET` |
| `/fakta`                 | GET    | Retrieve SIPK trivia data                        | Authenticated Users & Service | `FAKTA` |
| `/login`                 | POST   | Handle user email login                          | Public                      | `LOGIN` |
| `/logout`                | POST   | Handle user logout                               | Authenticated Users & Service (Service not implemented) | `LOGOUT` |
| `/magiclink`             | POST   | Send a magic link to user email for login        | Public                      | `MAGICLINK` |
| `/matkul`                | GET    | Get user courses                                 | Authenticated Users & Service | `MATKUL` |
| `/matkul`                | POST   | Add user courses                                 | Authenticated Users & Service (Service not implemented) | `MATKUL` |
| `/matkul`                | PATCH  | Update user courses                              | Authenticated Users & Service (Service not implemented) | `MATKUL` |
| `/matkul`                | DELETE | Delete user courses                              | Authenticated Users & Service (Service not implemented) | `MATKUL` |
| `/matkul-history`        | GET    | Get user course history                          | Authenticated Users & Service | `MATKULHISTORY` |
| `/matkul-history`        | DELETE | Delete user course history                       | Authenticated Users & Service (Service not implemented) | `MATKULHISTORY` |
| `/me`                    | GET    | Get user profile and preferences                 | Authenticated Users & Service | `ME` |
| `/me`                    | PATCH  | Update user profile and preferences              | Authenticated Users & Service (Service not implemented) | `ME` |
| `/notifikasi`            | GET    | Retrieve SIPK notification news                 | Authenticated Users & Service | `NOTIFIKASI` |
| `/password`              | PATCH  | Update user password                             | Authenticated Users & Service (Service not implemented) | `PASSWORD` |
| `/rating`                | GET    | Get user ratings                                 | Authenticated Users & Service | `RATING` |
| `/rating`                | POST   | Add user ratings                                 | Authenticated Users & Service (Service not implemented) | `RATING` |
| `/rating`                | PATCH  | Update user ratings                              | Authenticated Users & Service (Service not implemented) | `RATING` |
| `/register`              | POST   | Handle user email registration                   | Public                      | `REGISTER` |
| `/service/revalidate-cache` | POST | Revalidate Next.js cache                         | Service                     | `SERVICE` |
| `/universitas`           | GET    | Retrieve university data                         | Authenticated Users & Service | `UNIVERSITAS` |

### API Error Responses

| HTTP Code | SIPK Code  | Description                                                                                   |
|-----------|------------|-----------------------------------------------------------------------------------------------|
| 400       | `BR_00`    | Invalid JSON format in the request body                                                      |
| 400       | `BR_01`    | Form data validation failed                                                                  |
| 400       | `BR_02`    | Invalid request parameters                                                                  |
| 401       | `AUTH_00`  | Missing user access token or `_Secure-auth.session-token` cookie                             |
| 401       | `AUTH_01`  | Missing `Authorization` header or session token                                              |
| 401       | `AUTH_02`  | Expired user access token or session token                                                   |
| 401       | `AUTH_03`  | Missing or invalid session token                                                             |
| 401       | `AUTH_04`  | Invalid user access token                                                                    |
| 401       | `AUTH_05`  | Missing or invalid API key or service role key                                               |
| 401       | `AUTH_06`  | Incorrect email or password                                                                  |
| 401       | `AUTH_07`  | Missing or invalid token hash                                                                |
| 429       | `RL_00`    | Rate limit reached                                                                           |
| 503       | `RL_01`    | Maximum rate limit token count exceeded                                                      |
| 500       | `SRV_00`   | Server error, usually due to a Supabase database query                                       |
| 503       | `SRV_01`   | Server is busy, overloaded, or under maintenance                                             |
| 501       | `SRV_02`   | Unsupported request                                                                          |
| 503       | `SRV_03`   | New account registration limit reached                                                       |
| 404       | `NF_00`    | Resource not found                                                                           |
| 409       | `CF_00`    | Resource conflict, such as duplicate resource                                                |

## Environment Variables

### NEXT_PUBLIC_*

| Variable Name         | Type     | Description                                        | Example Value             | Required |
|-----------------------|----------|----------------------------------------------------|---------------------------|----------|
| `NEXT_PUBLIC_SIPK_URL` | URL | Base URL.  | `http://localhost:3000` | Yes |
| `NEXT_PUBLIC_SIPK_API_URL` | URL | Base API URL used to resolve data with SWR hooks. Use empty string when same as  `NEXT_PUBLIC_SIPK_URL`. | `https://api.sipk.fun` | Yes |
| `NEXT_PUBLIC_HCAPTCHA_SITEKEY` | String | HCaptcha site key. While in development, captcha can be bypassed using key in example.  | `10000000-ffff-ffff-ffff-000000000001` | Yes |
| `NEXT_PUBLIC_BUGSNAG_SITEKEY` | String | Bugsnag API key.  | `j547bk0pvsd74xd3wwhirg16zc88la6j` | Yes |
| `NEXT_PUBLIC_APP_VERSION` | String | Application version refer to `version` on [package](package.json) and generated on Next.js [config](next.config.js). | `1.0.0` | Optional |

### SUPABASE_*

| Variable Name         | Type     | Description                                        | Example Value             | Required |
|-----------------------|----------|----------------------------------------------------|---------------------------|----------|
| `SUPABASE_URL` | URL | Supabase base URL.  | `https://xbdytyuaqzzmjfrumzab.supabase.co` | Yes |
| `SUPABASE_API_URL` | URL | Supabase REST API URL. | `https://xbdytyuaqzzmjfrumzab.supabase.co/rest/v1` | Yes |
| `SUPABASE_ANON_KEY` | String | Supabase anon key.  | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiSm9obiBEb2UifQ.DjwRE2jZhren2Wt37t5hlVru6Myq4AhpGLiiefF69u8` | Yes |
| `SUPABASE_SERVICE_KEY` | String | Supabase service key.  | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiSm9obiBEb2UifQ.DjwRE2jZhren2Wt37t5hlVru6Myq4AhpGLiiefF69u8` | Yes |

### API_*

| Variable Name         | Type     | Description                                        | Default Value             | Required |
|-----------------------|----------|----------------------------------------------------|---------------------------|----------|
| `API_[SLUG]_REQUEST_LIMIT` | String | Maximum request limit to refered API endpoint [SLUG](https://github.com/rheyhannh/sipk-app/edit/origin/stable/README.md#api-endpoints) to each ratelimit token. | - | Required |
| `API_[SLUG]_MAX_TOKEN_PERINTERVAL` | String | Maximum stored ratelimit token refered to API endpoint [SLUG](https://github.com/rheyhannh/sipk-app/edit/origin/stable/README.md#api-endpoints). | `500` | Optional |
| `API_[SLUG]_TOKEN_INTERVAL_SECONDS` | String | Interval to reset stored ratelimit token refered to API endpoint [SLUG](https://github.com/rheyhannh/sipk-app/edit/origin/stable/README.md#api-endpoints). | `60` | Optional |

### JWT_*

| Variable Name    | Type   | Description                                                                                                   | Example Value                                      | Required |
| ---------------- | ------ | ------------------------------------------------------------------------------------------------------------- | -------------------------------------------------- | -------- |
| `JWT_ALGORITHM`  | String | Specifies one or more JWT algorithms, separated by commas. Ensure the algorithm used by Supabase is included. | `HS256`                                            | Yes      |
| `JWT_ISSUER`     | String | Specifies one or more JWT issuers, separated by commas. Ensure the Supabase issuer is included.               | `https://xbdytyuaqzzmjfrumzab.supabase.co/auth/v1` | Yes      |
| `JWT_SECRET_KEY` | String | Refers to the JWT secret key used by Supabase.                                                                | `jcGzD4u&tHzK&br2pjjUQARhzo%LnEt!`                 | Yes      |

### MISC

| Variable Name    | Type   | Description                                                                                                   | Example Value                                      | Required |
| ---------------- | ------ | ------------------------------------------------------------------------------------------------------------- | -------------------------------------------------- | -------- |
| `USER_SESSION_COOKIES_NAME`  | String | SIPK secure session cookie name. | `_Secure-session` | Yes |
| `SECRET_KEY`     | String | Secret key to encrypt users sessions. | `BJF4QYmjOteU1olNdHTUxJKDK6LOgkAm` | Yes |
| `MAXIMUM_REGISTERED_USER` | String | Maximum number of registered users. When this limit is reached, `api/register` will return an error response with the code `SRV_03`. | `500` | Yes |
| `KEY_MAILGUN_APIKEY` | String | Mailgun api key that allows to perform all CRUD operations via various API endpoints | `2po8mU5DYP66FwtsGYa+VLWy0OI80FLThltuwiGd` | No |
