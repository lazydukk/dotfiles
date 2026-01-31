-- load defaults i.e lua_lsp
require("nvchad.configs.lspconfig").defaults()

local lspconfig = require("lspconfig")

lspconfig.servers = {
    "lua_ls",
    "clangd",
    "marksman",
}

-- list of servers configured with default config
local default_servers = { "clangd" }
local nvlsp = require("nvchad.configs.lspconfig")

-- lsps with default config
for _, lsp in ipairs(default_servers) do
    lspconfig[lsp].setup({
        on_attach = nvlsp.on_attach,
        on_init = nvlsp.on_init,
        capabilities = nvlsp.capabilities,
    })
end

lspconfig.lua_ls.setup({
    on_attach = nvlsp.on_attach,
    on_init = nvlsp.on_init,
    capabilities = nvlsp.capabilities,

    settings = {
        Lua = {
            diagnostics = {
                enable = true, -- Disable all diagnostics from lua_ls
                globals = { "vim" },
            },
            workspace = {
                library = {
                    vim.fn.expand("$VIMRUNTIME/lua"),
                    vim.fn.expand("$VIMRUNTIME/lua/vim/lsp"),
                    vim.fn.stdpath("data") .. "/lazy/ui/nvchad_types",
                    vim.fn.stdpath("data") .. "/lazy/lazy.nvim/lua/lazy",
                },
                maxPreload = 100000,
                preloadFileSize = 10000,
            },
        },
    },
})
