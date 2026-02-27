---
title: 强大的包管理-Poetry
date: 2024-9-5 00:00:00
tags: 
  - 编程
  - python
  - 工具
  - 介绍
reprintPolicy:  cc_by_nc_nd
---
==别看了, 去看隔壁uv吧==
# 简介
> Poetry 是一个现代化的 Python 依赖管理和打包工具, 它简化了 Python 项目的依赖管理和打包发布流程. 

# 有何优势? 
pip 可以安装来自 PyPI 的包, 而 Poetry 不止于安装 PyPI 的包, 它还可以自动地从源码安装、从远程目标安装, 甚至是从远程 git 仓库安装. 

而包管理只是 Poetry 的一部分, 同样重要的是 Poetry 的打包发布和环境管理的功能. 自动化的打包发布, 极大节省了开发者的时间. 强大的环境管理, 使其拥有纯虚拟环境无法比拟的优势: 

- 精确的依赖解析: 避免依赖冲突
- 清晰的依赖分组: 区分开发和生产环境依赖
- 锁文件机制: 确保开发和生产环境的一致性
- 一体化工具: 从项目创建到发布的全流程支持

# 如何安装? 
Poetry 有多种安装方式, 但其中使用 pip 是不推荐的, 使用 pip 安装容易污染环境. 

注:  Poetry 需要 Python 3.8 及以上版本. 

## 官方脚本
### Windows  (PowerShell) 
```powershell
 (Invoke-WebRequest -Uri https: //install.python-poetry.org -UseBasicParsing) .Content | py -
```

### Linux,  macOS,  Windows  (WSL) 
```bash
curl -sSL https: //install.python-poetry.org | python3 -
```

安装完成后, 建议将 Poetry 添加到系统 PATH: 
```bash
export PATH="$HOME/.local/bin: $PATH"
```

## pipx (推荐) 
```bash
pipx install poetry
```

# 基本用法
## 初始化
- 新项目
```bash
poetry new your_project_name
```

- 现有非 Poetry 项目
```bash
poetry init
```

- 现有 Poetry 项目
```bash
poetry install
```

### poetry new
poetry new 将会在当前工作目录下创建一个项目文件夹以及项目脚手架, 包括: 
```
your_project_name/
├── pyproject.toml  # 项目配置文件
├── README.md
├── your_project_name/  # 项目主目录
│   └── __init__.py
└── tests/  # 测试目录
    └── __init__.py
```

### poetry init
poetry init 将会以工作目录为项目文件夹, 通过交互式问答创建 pyproject.toml 配置文件. 

### poetry install
poetry install 会根据 pyproject.toml 配置文件安装项目所需依赖, 并创建 poetry.lock 文件锁定依赖版本. 

## 激活虚拟环境
### 直接运行命令行
```bash
poetry run your_command
```
例如运行 start.py: 
```bash
poetry run python start.py
```

### 启用虚拟环境 shell
```bash
poetry shell
```
即可进入虚拟环境. 退出虚拟环境使用: 
```bash
exit
```

## 安装软件包
Poetry 可以从各种途径安装软件包, 除了默认的 PyPI, 还可以从网络甚至是 git 安装. 

```bash
poetry add package_name # 从 PyPI 添加包
poetry add package_name@^1.2.3 # 指定版本范围
poetry add https: //github.com/Suto-Commune/anyquote/archive/refs/tags/1.0.0.tar.gz # 从源码添加
poetry add git+https: //github.com/Suto-Commune/sutowebdav.git # 从 git 安装
poetry add pytest --group dev # 添加包至 dev 组
```

### 换源
在 pyproject.toml 中加入以下段落即可: 
```toml
[[tool.poetry.source]]
name = "tuna"
url = "https: //mirrors.tuna.tsinghua.edu.cn/pypi/web/simple/"
default = true
```

或是运行命令行: 
```bash
poetry source add --priority=primary tuna https: //mirrors.tuna.tsinghua.edu.cn/pypi/web/simple/
```

## 卸载软件包
```bash
poetry remove package_name
```

## 更新软件包
```bash
poetry update # 更新所有软件包
poetry update package_name # 更新指定包
poetry lock --no-update # 仅刷新 lock 文件不更新依赖
```

# 打包上传
## 打包
```bash
poetry build
```
运行此命令后 Poetry 会自动将项目打包并在 dist 目录下输出源码压缩文件和 wheel 包. 

## 上传
1. 首先在 PyPI 注册账号并获取 API token
2. 配置 Poetry 使用 token: 
```bash
poetry config pypi-token.pypi your-token-here
```
3. 发布包: 
```bash
poetry publish
```

* 建议在打包后上传前先检查打包内容: 
```bash
twine check dist/*
```

# 导出为 Requirements.txt
第一次使用 Poetry 时疑惑过, Poetry 会不会提高安装门槛, 后来看来是没必要担心的, Poetry 支持导出项目依赖: 

```bash
# 导出主依赖
poetry export --format requirements.txt --output requirements.txt --without-hashes

# 导出开发依赖
poetry export --format requirements.txt --output requirements-dev.txt --without-hashes --only dev
```

# 进阶功能
## 脚本定义
在 pyproject.toml 中定义脚本: 
```toml
[tool.poetry.scripts]
my-script = "my_module: main_function"
```
然后可以通过 Poetry 运行: 
```bash
poetry run my-script
```

## 环境管理
查看当前环境信息: 
```bash
poetry env info
```

列出所有虚拟环境: 
```bash
poetry env list
```

删除虚拟环境: 
```bash
poetry env remove python版本
```

## 多环境支持
Poetry 支持通过环境变量指定 Python 版本: 
```bash
poetry env use python3.9
```

# 常见问题
## 与现有项目整合
如果要将现有项目迁移到 Poetry: 
1. 删除原有的虚拟环境
2. 运行 `poetry init` 创建 pyproject.toml
3. 使用 `poetry add` 添加依赖
4. 运行 `poetry install` 创建新的虚拟环境

## 性能优化
如果依赖解析速度慢, 可以尝试: 
```bash
poetry config experimental.new-installer false
```

## 版本控制
建议将以下文件加入版本控制: 
- pyproject.toml
- poetry.lock

而忽略: 
- __pycache__/
- *.egg-info/
- .venv/
