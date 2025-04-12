---
title: "关我辟事 Vol.04 | 一次远程仓库提交报错"
date: 2025-03-12T08:00:00.000+00:00
lang: zh
type:
duration:
description:
place:
tocAlwaysOn: false
image:
recording:
redirect:
placeLink:
inperson:
---

[[toc]]

最近计划用另一台 Surface 管理此网站的内容更新，在使用 Git 提交代码 `git push` 时，多次出现了以下错误信息。

```bash
fatal: unable to access 'https://github.com/username/username.github.io.git/': OpenSSL SSL_read: SSL_ERROR_SYSCALL, errno 0
```

根据提示判断可能是本地 SSL 证书过期或损坏，导致 Github 服务器不能正确验证 Git 身份。不久之前此台电脑在上传代码时新配置了 SSH Key，检查证书后发现没有问题。~~其实将 Git 远程仓库 URL 切换为 SSH 可能就不会报错了。~~

直觉判断是网络问题。又经过了多次 `push` 后，终于提示需要登录信息。

```bash
$ git commit -m "~"
Author identity unknown

*** Please tell me who you are.

Run

  git config --global user.email "you@example.com"
  git config --global user.name "Your Name"

to set your account's default identity.
Omit --global to set the identity only in this repository.
```

> **Github 对密码身份验证的支持已于2021年8月13日删除。请改用Personal Access Token**。

> When you `git clone`, `git fetch`, `git pull`, or `git push` to a private remote repository using HTTPS URLs on the command line, Git will ask for your GitHub username and password. When Git prompts you for your password, enter your personal access token. Alternatively, you can use a credential helper like [Git Credential Manager](https://github.com/git-ecosystem/git-credential-manager/blob/main/README.md). Password-based authentication for Git has been removed in favor of more secure authentication methods. For more information, see [Managing your personal access tokens](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens).

---

### 使用 Personal Access Token（PAT）

首先，检查当前 Git 仓库的远程地址 `git remote -v`，返回得到 HTTP URL，需要使用 Personal Access Token（PAT） 进行身份认证，而不是 GitHub 密码。

- 获取 GitHub Token

- 更新 Git 远程 URL

```bash
git remote set-url origin https://your-token@github.com/your-username/repository.git
```

### 使用 SSH 认证

生成 SSH Key，通常存储在 `~/.ssh/id_rsa.pub`

```bash
ssh-keygen -t rsa -b 4096 -C "your-email@example.com"
```

复制公钥并添加到 GitHub：

```bash
cat ~/.ssh/id_rsa.pub
```

重新测试 SSH 连接：

```bash
ssh -T git@github.com
```

将 Git 远程仓库 URL 切换为 SSH（如果当前是 HTTPS）：

```bash
git remote set-url origin git@github.com:your-username/repository.git
```
