---
name: generate-admin-page
description: Generates a standard directory structure for Admin pages. Use this skill when the user requests "use skill Directory Structure" or "use skill generate-admin-page" along with a page name or design link.
---

# Admin Page Structure Protocol: generate-admin-page

This protocol is activated ONLY when the command **"use skill generate-admin-page"** or **"use skill Directory Structure"** is issued.

## 📌 Workflow Overview
Upon receiving one or multiple page names (or Figma links), the AI must treat each as a unique **Admin Page**. The AI must automatically generate the folder structure following the **Admin Page-based Architecture** described below.

## 🏗 Directory Structure (MANDATORY ENGLISH NAMING)

The generated output MUST use **English names** for all folders and files, even if the user provides the request in another language.

```text
src/
└── adminpages/                 # Root folder for all admin pages
    └── [page_name_english]/    # Page folder (lowercase, English, no spaces)
        ├── components/         # Internal components (English naming)
        │   ├── ComponentName.jsx   # (e.g., SidebarMenu, DataTable, FilterBar)
        │   └── ...
        └── PageComponent.jsx   # Main component (PascalCase, English)
```

## 📝 Implementation Guidelines for AI

1.  **Enforce English Naming**:
    - If the user provides a page name in Vietnamese (e.g., "Đăng nhập"), you MUST translate it to English (e.g., `login`) BEFORE creating the structure.
    - Example 1: "Quản lý vé" -> translate to "Ticket Management" -> use `ticketmanagement`.
    - Example 2: "Trang chủ" -> translate to "Dashboard" or "Home" -> use `dashboard`.

2.  **Naming the Folder (page_name_english)**:
    - Use lowercase English.
    - No spaces or special characters.
    - Example: "User Management" -> `usermanagement`.

3.  **Naming the Main Component (PageComponent.jsx)**:
    - Use **PascalCase English** based on the translated name.
    - Example: `usermanagement` -> `UserManagement.jsx`.

4.  **Directory Creation**:
    - Create the folder tree in `src/adminpages/`.
    - Ensure `src/adminpages/[page_name]/components/` exists.

5.  **PageComponent.jsx Boilerplate**:
    - Provide a basic React component in English.

6.  **Batch Processing**:
    - Process multiple pages sequentially, applying translation to each.

## 🚀 Examples

**Request**: "dùng skill generate-admin-page cho trang Quản lý đơn hàng"
**AI Execution**:
1. Translate "Quản lý đơn hàng" -> "Order Management".
2. Create directory: `src/adminpages/ordermanagement/components/`
3. Create file: `src/adminpages/ordermanagement/OrderManagement.jsx`

**Request**: "use skill generate-admin-page for Login link"
**AI Execution**:
1. Create directory: `src/adminpages/login/components/`
2. Create file: `src/adminpages/login/Login.jsx`