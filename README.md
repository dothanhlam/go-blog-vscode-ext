# Go Blog VS Code Extension

**Turn Visual Studio Code into your personal Content Management System.**

This extension allows you to manage your blog posts directly from VS Code. Write in Markdown, save your file, and let the extension handle the synchronization with your blog's backend.

## 🚀 Features

-   **Sync on Save**: Automatically updates your blog post when you save the file.
-   **Link Existing Posts**: Connect a local Markdown file to an existing post on your blog.
-   **Front Matter Management**: Automatically manages post metadata (ID, title, status) using YAML front matter.
-   **Multi-Blog Support**: Configure multiple blogs in a single workspace.

## 🛠️ Setup

1.  Create a `blog-config.json` file in the root of your workspace.
2.  Define your blog configuration:

```json
{
    "name": "My Tech Blog",
    "api": {
        "baseUrl": "https://api.myblog.com",
        "listPostsEndpoint": "/posts",
        "createPostEndpoint": "/posts",
        "updatePostEndpoint": "/posts/{id}"
    },
    "postsDirectory": "content/posts"
}
```

## 📖 Usage

### Linking a Post
1.  Open a Markdown file.
2.  Run the command `Blog: Link to Existing Post` (Cmd+Shift+P -> `Blog: Link to Existing Post`).
3.  Select the post you want to link to.
4.  The extension will add the necessary front matter (e.g., `blog_id`) to your file.

### Syncing
1.  Edit your Markdown file.
2.  Save the file (Cmd+S).
3.  The extension detects the `blog_id` in the front matter and pushes the changes to your API.
4.  Check the status bar for a success message (e.g., `✅ My Tech Blog: Synced`).

## 📦 Requirements

-   A backend API that supports JSON for listing, creating, and updating posts.
-   VS Code 1.80.0 or higher.

## 🤝 Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

---
*Built with ❤️ for writers who love code.*
