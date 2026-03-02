`<leader>` = for NvChad menu
`<leader> /` = uncomment a line
`<CTRL> n` = file menu
    `d` = delete file
    `a` = create a new file

---
- `:TSUpdate` = treesitter update
- `:TSInstall` = install a treesitter

---
- To skip a plugin installing automatically add it to `./lua/configs/mason-conform.lua)`
- To ensure that a plugin is installed, add it to `./lua/configs/mason-lspconfig.lua)`

## Issues
- luacheck won't install in windows;
- resources: [luarocks.nvim](https://github.com/vhyrro/luarocks.nvim) / [lunarmodules/luacheck](https://github.com/lunarmodules/luacheck?tab=readme-ov-file#installation)
    - Download [luacheck.exe](https://github.com/lunarmodules/luacheck/releases/download/v1.2.0/luacheck.exe)
    - Then go to `../nvim-data/mason/bin/` and add  `luarocks.cmd` from `./example/`
    - Then go to `../nvim-data/mason/packages/` Inside it, create a dir called `./luacheck` and then add the `luacheck.exe` from earlier.
