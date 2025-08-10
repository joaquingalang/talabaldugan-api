# 🇵🇭 Talabaldugan API 📖

A simple REST API for retrieving words from the Talabaldugan dataset, supporting searches by numeric ID, exact spelling, or normalized forms (accent-insensitive).

Base URL: `https://talabaldugan-api.onrender.com`

## Endpoints

### 1. Get word by numeric ID

```
GET /api/id/:id
```

Example:

```
https://talabaldugan-api.onrender.com/api/id/42
```

Output:
```
{
  "id": 11,
  "word": "abbual",
  "definition": "n. when a big tree falls down",
  "audio": "https://aqpogjkniikzxfygnsmm.supabase.co/storage/v1/object/sign/pronouncation/A/AB-BUAL.mp3?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9mN2JkZmNmZC1jMGZhLTQ3YWUtYTc0Ni02ZDBlZjEyMDUzOTIiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJwcm9ub3VuY2F0aW9uL0EvQUItQlVBTC5tcDMiLCJpYXQiOjE3NTQ4MDI5MzIsImV4cCI6MTkxMjQ4MjkzMn0.eaDjlnUcwuTSq3gUW1PTWYfHvS_cnZIqcIzrqupWATU"
}
```


### 2. Get word by exact or normalized match

```
GET /api/word/:word
```

Example:

```
https://talabaldugan-api.onrender.com/api/word/saya
```

Output:
```
[
  {
    "id": 2380,
    "word": "sayâ",
    "definition": "n. happiness; syn. tula",
    "audio": "https://aqpogjkniikzxfygnsmm.supabase.co/storage/v1/object/sign/pronouncation/S/SAYA.mp3?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9mN2JkZmNmZC1jMGZhLTQ3YWUtYTc0Ni02ZDBlZjEyMDUzOTIiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJwcm9ub3VuY2F0aW9uL1MvU0FZQS5tcDMiLCJpYXQiOjE3NTQ4MzQ0NTIsImV4cCI6MjEzMzI2NjQ1Mn0.iu5mTJJHlEJMDgtuM3XMdWA0khLG9_KkHdMNY3uKFus"
  }
]
```

### 3. Get entries from ID 1 to n

```
GET /api/ids/:n
```

Example:

```
https://talabaldugan-api.onrender.com/api/ids/3
```

Output:
```
[
  { "id": 1, "word": "abiás", "definition": "..." },
  { "id": 2, "word": "abú", "definition": "..." },
  { "id": 3, "word": "adál", "definition": "..." }
]
```

### 4. Get all words starting with a specific letter

```
GET /api/starts/:letter
```

Example:

```
https://talabaldugan-api.onrender.com/api/starts/a
```

Output:
```
[
  { "id": 1, "word": "abiás", "definition": "..." },
  { "id": 2, "word": "abú", "definition": "..." },
  { "id": 3, "word": "adál", "definition": "..." }
]
```


## Source

This API is based on TALABALDUGAN: An English-Kapampangan and Kapampangan-English Dictionary by Joel Pabustan Mallari.


