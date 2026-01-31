require("nvchad.options")

-- add yours here!

local o = vim.o

-- Indenting
o.shiftwidth = 4
o.tabstop = 4
o.softtabstop = 4
o.cursorlineopt = "both" -- to enable cursorline!

-- use pwsh as the default
local use_pwsh = true -- weather to enable pwsh or not

local is_windows = vim.fn.has("win32") ~= 0
if use_pwsh and is_windows then
    -- ref: https://neovim.io/doc/user/options.html#'shell'
    o.shell = vim.fn.executable("pwsh") and "pwsh" or "powershell"
    o.shellcmdflag =
        "-NoLogo -ExecutionPolicy RemoteSigned -Command [Console]::InputEncoding=[Console]::OutputEncoding=[System.Text.UTF8Encoding]::new();$PSDefaultParameterValues['Out-File:Encoding']='utf8';Remove-Alias -Force -ErrorAction SilentlyContinue tee;"
    o.shellredir = '2>&1 | %%{ "$_" } | Out-File %s; exit $LastExitCode'
    o.shellpipe = '2>&1 | %%{ "$_" } | tee %s; exit $LastExitCode'
    o.shellquote = ""
    o.shellxquote = ""
end
