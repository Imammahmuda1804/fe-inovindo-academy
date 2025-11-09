# Dokumentasi API LMS

Berikut adalah dokumentasi untuk semua endpoint API yang tersedia di dalam proyek.

---

## Daftar Isi
1.  [Autentikasi](#autentikasi)
2.  [Courses](#courses)
3.  [Struktur Kursus (Sections & Contents)](#struktur-kursus-sections--contents)
4.  [Kategori](#kategori)
5.  [Mentor](#mentor)
6.  [Transaksi](#transaksi)
7.  [Statistik Umum](#statistik-umum)

---

## 1. Autentikasi

Endpoint yang berhubungan dengan registrasi, login, dan manajemen profil pengguna.

### **POST** `/api/register`

Mendaftarkan pengguna baru dengan role default `student`.

- **Body Request**:
  ```json
  {
      "name": "Nama Lengkap",
      "email": "email@example.com",
      "password": "passwordanda",
      "password_confirmation": "passwordanda"
  }
  ```
- **Response Sukses (201 Created)**:
  ```json
  {
      "message": "User successfully registered",
      "user": {
          "name": "Nama Lengkap",
          "email": "email@example.com",
          "id": 1
      }
  }
  ```

### **POST** `/api/login`

Mengautentikasi pengguna dan mengembalikan JWT.

- **Body Request**:
  ```json
  {
      "email": "email@example.com",
      "password": "passwordanda"
  }
  ```
- **Response Sukses (200 OK)**:
  ```json
  {
      "access_token": "jwt-token",
      "token_type": "bearer",
      "expires_in": 3600,
      "user": {
          "id": 1,
          "name": "Nama Pengguna",
          "email": "email@example.com",
          "roles": ["student"]
      }
  }
  ```

### **GET** `/api/me`

Mendapatkan detail pengguna yang sedang login. (Auth: Diperlukan)

### **POST** `/api/me`

Memperbarui profil pengguna yang sedang login. (Auth: Diperlukan)

### **POST** `/api/logout`

Menginvalidasi token pengguna. (Auth: Diperlukan)

### **POST** `/api/refresh`

Memperbarui token JWT yang sudah ada. (Auth: Diperlukan)

---

## 2. Courses

Endpoint untuk mengelola dan melihat data kursus.

### **GET** `/api/courses`

Mendapatkan semua katalog kursus.
- **Response Sukses (200 OK)**:
  ```json
  {
      "status": "success",
      "message": "Course catalog retrieved successfully",
      "count": 1,
      "data": [
          {
              "id": 1,
              "title": "Full-Stack Web Developer",
              "slug": "full-stack-web-developer",
              "creation_year": 2025,
              "students_count": 50
          }
      ]
  }
  ```

### **GET** `/api/courses/popular`

Mendapatkan daftar kursus populer.
- **Response Sukses (200 OK)**:
  ```json
  {
      "status": "success",
      "message": "Popular courses retrieved successfully",
      "data": [
          {
              "id": 1,
              "title": "Full-Stack Web Developer",
              "slug": "full-stack-web-developer",
              "creation_year": 2025,
              "students_count": 50,
              "category": {
                  "id": 1,
                  "name": "Web Development"
              }
          }
      ]
  }
  ```

### **GET** `/api/courses/{slug}`

Mendapatkan detail kursus berdasarkan `slug`.
- **Response Sukses (200 OK)**:
  ```json
  {
      "status": "success",
      "message": "Course details retrieved successfully",
      "data": {
          "id": 1,
          "title": "Full-Stack Web Developer",
          "slug": "full-stack-web-developer",
          "creation_year": 2025,
          "description": "Deskripsi lengkap kursus...",
          "category": { "id": 1, "name": "Web Development" },
          "mentors": [ { "id": 1, "name": "Budi Doremi" } ]
      }
  }
  ```

### **GET** `/api/courses/category/{categorySlug}`

Mendapatkan kursus berdasarkan `slug` kategori.
- **Response Sukses (200 OK)**:
  ```json
  {
      "status": "success",
      "message": "Courses for category 'web-development' retrieved successfully",
      "count": 1,
      "data": [
          {
              "id": 1,
              "title": "Full-Stack Web Developer",
              "slug": "full-stack-web-developer",
              "creation_year": 2025
          }
      ]
  }
  ```

### **GET** `/api/courses/{courseId}/pricings`

Mendapatkan informasi harga dari sebuah kursus.

### **POST** `/api/courses`

Membuat kursus baru (Auth: `admin`/`mentor`).
- **Response Sukses (201 Created)**:
  ```json
  {
      "status": "success",
      "message": "Course created successfully",
      "data": {
          "id": 16,
          "title": "Belajar Laravel dari Dasar",
          "creation_year": 2025
      }
  }
  ```

### **PUT** `/api/courses/{id}`

Memperbarui kursus (Auth: `admin`/`mentor`).

### **DELETE** `/api/courses/{id}`

Menghapus kursus (Auth: `admin`/`mentor`).

---

## 3. Struktur Kursus (Sections & Contents)

Endpoint untuk mengelola bagian (section) dan konten di dalamnya.

### **GET** `/api/courses/{courseId}/sections`
Melihat daftar semua section dalam sebuah kursus.

### **GET** `/api/sections/{sectionId}`
Melihat detail sebuah section.

### **GET** `/api/sections/{sectionId}/contents`
Melihat daftar semua konten dalam sebuah section.

### **GET** `/api/contents/{contentId}`
Melihat detail sebuah konten.

### **POST** `/api/sections`
Membuat section baru (Auth: `admin`/`mentor`).

### **PUT** `/api/sections/{sectionId}`
Memperbarui section (Auth: `admin`/`mentor`).

### **DELETE** `/api/sections/{sectionId}`
Menghapus section (Auth: `admin`/`mentor`).

### **POST** `/api/contents`
Membuat konten baru (Auth: `admin`/`mentor`).

### **PUT** `/api/contents/{contentId}`
Memperbarui konten (Auth: `admin`/`mentor`).

### **DELETE** `/api/contents/{contentId}`
Menghapus konten (Auth: `admin`/`mentor`).

---

## 4. Kategori

### **GET** `/api/categories`

Mengambil daftar semua kategori kursus yang tersedia.
- **Response Sukses (200 OK)**:
  ```json
  {
      "status": "success",
      "message": "Categories retrieved successfully",
      "data": [
          {
              "id": 1,
              "name": "Web Development",
              "slug": "web-development",
              "courses_count": 5
          }
      ]
  }
  ```

---

## 5. Mentor

Endpoint untuk melihat data mentor.

### **GET** `/api/mentors`
Mendapatkan daftar semua mentor.

### **GET** `/api/mentors/{userId}`
Mendapatkan profil publik seorang mentor.

### **GET** `/api/mentors/{mentorId}/courses`
Mendapatkan daftar kursus yang diajar oleh seorang mentor.

### **GET** `/api/mentors/category/{categorySlug}`
Mendapatkan daftar mentor berdasarkan kategori kursus yang diajar.

---

## 6. Transaksi

### **POST** `/api/transactions`

Membuat transaksi baru untuk pembelian kursus. (Auth: Diperlukan)
- **Response Sukses (201 Created)**:
  ```json
  {
      "status": "success",
      "message": "Transaction created successfully. Waiting for payment.",
      "data": {
          "id": 1,
          "user_id": 1,
          "course_id": 1,
          "status": "pending",
          "total_amount": 500000,
          "snap_token": "snap-token-midtrans"
      }
  }
  ```

---

## 7. Statistik Umum

### **GET** `/api/counts`

Mengambil data statistik jumlah total pengguna, kursus, dan mentor.
- **Response Sukses (200 OK)**:
  ```json
  {
      "users": 100,
      "courses": 15,
      "mentors": 10
  }
  ```