# hello, testing testing
oh-my-posh init pwsh --config 'C:\Users\bdas\omp-themes\gruvbox.omp.json' | Invoke-Expression

# custom git functions
# Status and Branching
function gs
{ git status $args
}
function gb
{ git branch $args
}
function gco
{ git checkout $args
}

# Commits and Staging
function ga
{ git add --all $args
}
function gc
{ git commit -m $args
}
function gca
{ git add --all; git commit -m $args
}

# Remote Operations
function gp
{ git push $args
}
function gl
{ git pull $args
}

# Logging
function glog
{ git log --oneline --graph --decorate $args
}

#custom commands
function sync ()
{
    syncthingtray
}
function macd ()
{
    docker start -i jerojero
    docker exec -it jerojero bash
}
function maco ()
{
    z macondo
    ./macondo.exe
}
function ankisync ()
{
    $env:SYNC_USER1="lazydukk:123"
    .\AppData\Local\Programs\Anki\anki-console.exe --syncserver
}
function jelly ()
{
    z server
    ./jellyfin.exe
}
function lit ()
{
    z lit
    py litstash.py
}

function stash ()
{
    z stash
    ./stash-win.exe
}
function tsh-bat ()
{
    z tsh
    ./strawberry-tsh.bat
}
function tsh ()
{
    z tsh
    ./tsh.pl
}
function btp
{
    z btop
    ./btop.exe
}
function beta ()
{
    z beta
    ./server.exe
}
function rio ()
{
    robocopy "E:\lazydukk\006 IOI" "E:\ioi\docs" /mir
}
function pwsl ()
{
    cd \\wsl.localhost\Arch\home\lazydukk
}
function docker-deb-lazy ()
{
    docker exec -it deb-lazy /bin/bash -c "su - lazydukk"
}
# Utility functions for zoxide.


# Call zoxide binary, returning the output as UTF-8.
function global:__zoxide_bin
{
    $encoding = [Console]::OutputEncoding
    try
    {
        [Console]::OutputEncoding = [System.Text.Utf8Encoding]::new()
        $result = zoxide @args
        return $result
    } finally
    {
        [Console]::OutputEncoding = $encoding
    }
}

# pwd based on zoxide's format.
function global:__zoxide_pwd
{
    $cwd = Get-Location
    if ($cwd.Provider.Name -eq "FileSystem")
    {
        $cwd.ProviderPath
    }
}

# cd + custom logic based on the value of _ZO_ECHO.
function global:__zoxide_cd($dir, $literal)
{
    $dir = if ($literal)
    {
        Set-Location -LiteralPath $dir -Passthru -ErrorAction Stop
    } else
    {
        if ($dir -eq '-' -and ($PSVersionTable.PSVersion -lt 6.1))
        {
            Write-Error "cd - is not supported below PowerShell 6.1. Please upgrade your version of PowerShell."
        } elseif ($dir -eq '+' -and ($PSVersionTable.PSVersion -lt 6.2))
        {
            Write-Error "cd + is not supported below PowerShell 6.2. Please upgrade your version of PowerShell."
        } else
        {
            Set-Location -Path $dir -Passthru -ErrorAction Stop
        }
    }
}

# =============================================================================
#
# Hook configuration for zoxide.
#

# Hook to add new entries to the database.
$global:__zoxide_oldpwd = __zoxide_pwd
function global:__zoxide_hook
{
    $result = __zoxide_pwd
    if ($result -ne $global:__zoxide_oldpwd)
    {
        if ($null -ne $result)
        {
            zoxide add -- $result
        }
        $global:__zoxide_oldpwd = $result
    }
}

# Initialize hook.
$global:__zoxide_hooked = (Get-Variable __zoxide_hooked -ErrorAction SilentlyContinue -ValueOnly)
if ($global:__zoxide_hooked -ne 1)
{
    $global:__zoxide_hooked = 1
    $global:__zoxide_prompt_old = $function:prompt

    function global:prompt
    {
        if ($null -ne $__zoxide_prompt_old)
        {
            & $__zoxide_prompt_old
        }
        $null = __zoxide_hook
    }
}

# =============================================================================
#
# When using zoxide with --no-cmd, alias these internal functions as desired.
#

# Jump to a directory using only keywords.
function global:__zoxide_z
{
    if ($args.Length -eq 0)
    {
        __zoxide_cd ~ $true
    } elseif ($args.Length -eq 1 -and ($args[0] -eq '-' -or $args[0] -eq '+'))
    {
        __zoxide_cd $args[0] $false
    } elseif ($args.Length -eq 1 -and (Test-Path $args[0] -PathType Container))
    {
        __zoxide_cd $args[0] $true
    } else
    {
        $result = __zoxide_pwd
        if ($null -ne $result)
        {
            $result = __zoxide_bin query --exclude $result -- @args
        } else
        {
            $result = __zoxide_bin query -- @args
        }
        if ($LASTEXITCODE -eq 0)
        {
            __zoxide_cd $result $true
        }
    }
}

# Jump to a directory using interactive search.
function global:__zoxide_zi
{
    $result = __zoxide_bin query -i -- @args
    if ($LASTEXITCODE -eq 0)
    {
        __zoxide_cd $result $true
    }
}

# =============================================================================
#
# Commands for zoxide. Disable these using --no-cmd.
#

Set-Alias -Name z -Value __zoxide_z -Option AllScope -Scope Global -Force
Set-Alias -Name zi -Value __zoxide_zi -Option AllScope -Scope Global -Force

# =============================================================================
#
# To initialize zoxide, add this to your configuration (find it by running
# `echo $profile` in PowerShell):
#
# Invoke-Expression (& { (zoxide init powershell | Out-String) })

# Import the Chocolatey Profile that contains the necessary code to enable
# tab-completions to function for `choco`.
# Be aware that if you are missing these lines from your profile, tab completion
# for `choco` will not function.
# See https://ch0.co/tab-completion for details.
$ChocolateyProfile = "$env:ChocolateyInstall\helpers\chocolateyProfile.psm1"
if (Test-Path($ChocolateyProfile))
{
    Import-Module "$ChocolateyProfile"
}
