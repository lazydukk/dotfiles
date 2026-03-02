local options = {
    ensure_installed = {
        "astro",
        "c",
        "cmake",
        "cpp",
        "css",
        "gitignore",
        "go",
        "html",
        "javascript",
        "json",
        "lua",
        "luadoc",
        "make",
        "markdown",
        "markdown_inline",
        "powershell",
        "printf",
        "python",
        "scss",
        "toml",
        "typescript",
        "vim",
        "vimdoc",
        "yaml",
    },

    highlight = {
        enable = true,
        use_languagetree = true,
    },

    indent = { enable = true },
}

require("nvim-treesitter.configs").setup(options)
