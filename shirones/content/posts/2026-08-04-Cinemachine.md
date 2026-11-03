---
title: Cinemachine 学习笔记
published: 2026-08-04T00:00:00.000Z
publishedAt: 2026-08-03T16:00:00.000Z
description: 从虚拟相机到跟随、构图与镜头切换，梳理 Unity Cinemachine 的核心概念和使用方式。
category: 学习记录
tags:
  - Unity
  - Cinemachine
  - 3C
  - 游戏开发
permalink: /posts/2026/08/04/Cinemachine学习/
lang: zh_CN
draft: false
---

## 一、为什么需要 Cinemachine

把 Unity 的 Camera 想象成一台**手持摄影机**，Cinemachine 就是给这台摄影机配了一个**智能摄影师**。

没有 Cinemachine 时，手写相机代码需要处理平滑跟随（Lerp/SmoothDamp）、碰撞检测、镜头切换过渡、震屏效果，代码量大且容易抖动。

Cinemachine 的核心思路：**不直接控制 Camera，而是创建虚拟相机（Virtual Camera）**。你只需告诉虚拟相机"跟着谁、看向谁、怎么跟、怎么看"，Cinemachine 自动把真实 Camera 驱动到位。

```
你操作 → Virtual Camera（虚拟相机）→ Cinemachine Brain → 真实 Camera
```

三个核心组件：

| 组件 | 作用 | 类比 |
|------|------|------|
| **Cinemachine Brain** | 挂在 Main Camera 上，接收虚拟相机的指令 | 摄影机的**马达** |
| **Virtual Camera** | 定义相机的位置、朝向、行为规则 | 摄影师脑子里的**构图方案** |
| **Blend** | 两个虚拟相机之间切换时的过渡动画 | 镜头之间的**转场** |

Virtual Camera 本质上是一个**配置预设**。不同场景各配一台，需要时一键切过去，Brain 自动帮你过渡。

```
角色在城里走路  →  Virtual Camera A（远跟，大FOV）
角色进入战斗    →  Virtual Camera B（近跟，肩后视角）
角色对话中      →  Virtual Camera C（固定机位，正反打）
```

---

## 二、Follow 与 Look At

打开一个 Virtual Camera，最先看到的就是这两个核心属性：

| 属性 | 作用 | 不设会怎样 |
|------|------|------------|
| **Follow** | 相机**位置**跟着谁 | 相机定在原地不动 |
| **Look At** | 相机**朝向**看着谁 | 相机朝向不变 |

常见组合：

- **只设 Follow，不设 Look At** → 相机跟着角色平移，但一直朝同一个方向看，角色走到前面只能看到背影
- **只设 Look At，不设 Follow** → 相机原地不动，但始终转头盯着角色，像个监控摄像头
- **两个都设** → 正常跟随，位置跟着走，视线也盯着角色

---

## 三、Body —— 控制相机位置

Body 决定相机以**什么方式**跟着 Follow 目标移动。

| Body 类型 | 行为 | 常见用途 |
|-----------|------|----------|
| **Transposer** | 和目标保持一个**固定偏移**，跟着平移 | 2D 横版、俯视角 |
| **Framing Transposer** | 在 Transposer 基础上加了**死区**，目标移动超出一定范围相机才动 | 第三人称跟随（最常用） |
| **Orbital Transposer** | 相机绕目标**旋转**，可以在轨道上滑动 | 配合鼠标旋转视角 |
| **Tracked Dolly** | 相机沿一条**预设轨道**滑动 | 赛车回放镜头 |
| **Hard Lock To Target** | 死死锁在目标上，1:1 跟着，无缓冲 | 第一人称、准星 |
| **Do Nothing** | 不动 | 固定机位 |

**Transposer vs Framing Transposer：**

```
Transposer:        角色微动一下相机也微动，画面晃
Framing Transposer: 角色在屏幕中央有个"死区框"，
                   角色在框内移动时相机不动，超出框了相机才跟 —— 画面稳
```

Framing Transposer 就是第三人称游戏中角色小幅移动画面不抖的原因。

---

## 四、Aim —— 控制相机朝向

Aim 决定相机**怎么对准** Look At 目标。

| Aim 类型 | 行为 | 常见用途 |
|----------|------|----------|
| **Composer** | 把目标放在画面的**黄金比例位置**（三分法构图） | 第三人称，角色偏画面下方 |
| **POV** | 鼠标/摇杆**自由旋转**视角 | FreeLook，自由视角 |
| **Group Composer** | 同时看向**多个目标**，自动调整 FOV 让它们都在画面内 | 多人对战 |
| **Hard Look At** | 死死盯着目标，无缓冲 | 过场动画 |
| **Same As Follow Target** | 朝向和 Follow 目标的前方向一致 | 自拍视角 |
| **Do Nothing** | 不转 | 固定镜头 |

### FOV（视场角 / Field of View）

就是"一眼能看到多宽"的范围，单位是**角度**。

```
小 FOV（30°）              大 FOV（90°）

 ┌──┐                      ┌─────────┐
 │  │  望远，                 │        │  宽广，
 │🧑│  像狙击镜               │   🧑   │  像广角镜
 └──┘                      └─────────┘
```

| FOV 值 | 视觉效果 | 游戏场景 |
|--------|----------|----------|
| 30°~40° | 物体放大，远处清晰，视野窄 | 狙击镜、瞄准镜 |
| 60° | 正常视角 | 大多数第三人称 |
| 90°~100° | 视野宽广，边缘拉伸变形 | 竞技 FPS |
| 120° | 鱼眼效果，严重畸变 | 极少使用 |

> FOV 只在透视相机（Perspective）里有。正交相机（Orthographic）用 **Size**（半高）控制视野，单位不是角度。

### Composer 的三分法构图

```
┌───────────────┐
│ ○  ○     ○  ○ │  网格交叉点是视觉焦点
│               │
│   ○   🎯  ○   │  Composer 把 Look At 目标放在
│               │  你指定的网格点上（默认中央偏下）
│   ○     ○     │
└───────────────┘
```

目标不在屏幕正中，而是偏上或偏下，留出**视线空间**——这是电影摄影里的构图规则。

---

## 五、Body + Aim 选配公式

```
第三人称跟随   = Framing Transposer + Composer
自由视角       = Orbital Transposer + POV
赛道回放       = Tracked Dolly + Composer
第一人称       = Hard Lock To Target + POV
多人同屏       = Framing Transposer + Group Composer
```

---

## 六、Framing —— 构图取景

Framing 的核心设计理念：**目标微动时画面稳，目标大动时相机跟上**。靠的是"三段式区域"。

### 三段式区域

```
目标往右走 →

        死区           软区                 画面外
    ┌─────────┬──────────────────┬─ ─ ─ ─ ─
    │         │                  │
    │   🧑    │     🧑→        │      🧑→→
    │         │                  │
    └─────────┴──────────────────┴─ ─ ─ ─ ─
    
    相机不动     相机开始追           相机死命追
    （稳如狗）   （缓缓跟上）         （赶紧框住）
```

### Dead Zone（死区）—— 画面最稳的地方

目标在死区里随便晃，相机完全不动。死区越大 → 画面越稳；死区越小 → 相机越灵敏，但画面可能"呼吸"。

### Soft Zone（软区）—— 缓冲地带

目标跨过死区边界，进入软区，相机开始"苏醒"，以阻尼（Damping）控制的速度缓缓跟上。

- 阻尼大 → 追得慢，平滑但有延迟感
- 阻尼小 → 响应快，但可能有点"硬"

### 软区之外 —— 硬追模式

目标超出软区边界，相机全力跟上，确保目标不跑出屏幕。

### Framing 参数速查表

| 参数 | 含义 | 调小 | 调大 |
|------|------|------|------|
| **Dead Zone Width / Height** | 死区宽/高（占屏幕比例） | 灵敏 | 稳 |
| **Soft Zone Width / Height** | 软区宽/高（占屏幕比例） | 快追 | 过渡缓和 |
| **Damping** | 相机追上的速度 | 响应快，可能生硬 | 平滑，有延迟感 |
| **Bias** | 追赶速度曲线 | 偏线性 | 先慢后快（缓入） |

---

## 七、Lookahead —— 预判跟拍

核心思想：不只是**跟在目标后面**，而是**猜到目标要去哪，提前往那边靠**。

```
没有 Lookahead                    有 Lookahead

→→→ 🧑                            →→→→ 🧑
       ↘ 相机（慢半拍）                 ↘ 相机（提前就位）
```

### 工作原理

```
1. 记录目标近期位置（时间窗口内的移动历史）
2. 根据速度/方向外推未来位置
3. 相机往预测位置偏移

时间 →
  t-2        t-1        t(现在)       预测位置
  🧑  ──→   🧑  ──→    🧑  ────→  👻
                                  ↑
                          相机提前往这里靠
```

### 关键参数

| 参数 | 含义 | 调小 | 调大 |
|------|------|------|------|
| **Lookahead Time** | 往前看多远（秒） | 几乎不预判 | 相机走在角色前面 |
| **Lookahead Smoothing** | 预测结果的平滑度 | 抖动，方向频繁跳变 | 平滑但方向改变时反应慢 |
| **Lookahead Ignore Y** | 是否忽略垂直方向预判 | 垂直也预判 | 只预判水平移动 |

### 什么时候用 / 什么时候关

- **适合开：** 横版/第三人称跑酷、赛车游戏、角色持续向前移动
- **应该关：** 第一人称（相机就是眼睛）、固定机位/对话、角色频繁变向

### Lookahead 与 Dead Zone 的关系

```
角色小幅晃动  → Dead Zone 吃掉，相机不动
角色加速跑    → 突破 Dead Zone，Lookahead 激活，相机提前追
角色急停      → Lookahead 归零，相机回到 Dead Zone 范围
角色突然反向  → Lookahead 重新计算，Smoothing 保证不会猛甩
```

Dead Zone 过滤微动噪音，Lookahead 响应持续意图。合在一起，相机像一个**有经验的摄影师**。

---

## 八、FreeLook Camera —— 轨道环绕相机

FreeLook 本质上是**三台虚拟相机绑在一起**，分别管上、中、下三个高度，鼠标在它们之间平滑切换。

```
       顶环（Top Rig）
      ╱    ← 俯视视角
     ╱
    ○    中环（Middle Rig）
    │     ← 平视
    │
    ○    底环（Bottom Rig）
          ← 仰视
```

| 概念 | 解释 |
|------|------|
| **三个 Rig** | Top / Middle / Bottom，各自有独立的轨道半径、高度、朝向 |
| **轨道（Orbit）** | 相机绕角色转，鼠标左右 = 沿轨道滑动 |
| **Y Axis** | 鼠标上下 = 在三个 Rig 之间混合 |

常见配置：

| Rig | 高度 | 效果 |
|-----|------|------|
| Top | 头顶上方 | 俯视，打怪时看全场 |
| Middle | 肩膀高度 | 标准第三人称 |
| Bottom | 腰以下 | 仰视，展示角色高大感 |

FreeLook 就是之前说的"鼠标控制视角"的标准方案。

---

## 九、State-Driven Camera —— 状态驱动切换

把相机绑定到角色的 Animator 上，角色状态一变，相机自动切，**0 行代码**。

```
角色 Animator 状态：

  Idle ──────→ 走路 ──────→ 跑步 ──────→ 战斗
   │             │             │             │
   ▼             ▼             ▼             ▼
相机A(远)    相机B(中)    相机C(近)    相机D(战斗视角)
```

| 配置项 | 作用 |
|--------|------|
| **Animated Target** | 拖入 Animator 组件 |
| **State → Camera 映射表** | Idle 用相机A，Walking 用相机B |
| **Default Camera** | 没匹配到状态时用哪台 |

---

## 十、Noise —— 噪声 / 震屏

给相机位置或朝向叠加**小幅随机抖动**，模拟手持摄影感或冲击反馈。

| Noise 类型 | 效果 | 用途 |
|------------|------|------|
| **Positional** | 相机位置抖动 | 地震、爆炸 |
| **Rotational** | 相机朝向抖动 | 手持摄影感、走路微晃 |
| **Basic Multi Channel** | 同时抖位置和朝向 | 最常用 |

核心参数：

| 参数 | 含义 | 调大效果 |
|------|------|----------|
| **Amplitude** | 抖动幅度 | 抖得更厉害 |
| **Frequency** | 抖动频率 | 抖得更快 |
| **Gain** | 抖动响度曲线 | 到达峰值更快 |

> 震屏要克制，一直抖玩家头晕，只在关键反馈时刻用。爆炸时 Gain 瞬间拉满，然后慢慢衰减回 0。

---

## 十一、Collision —— 碰撞检测

相机碰到墙壁等障碍物时自动拉近，避免穿墙。

```
没有碰撞检测                  有碰撞检测

     墙壁                       墙壁
  ┌─────────┐               ┌─────────┐
  │ 🧑     │               │ 🧑     │
  │    📷   │               │  📷←拉近│  ← 碰到墙了，自动拉近
  └─────────┘               └─────────┘
```

Cinemachine 提供 **Collider Extension**，加到 Virtual Camera 上即可。

### 两种策略

| 策略 | 行为 | 特点 |
|------|------|------|
| **Pull Camera Forward** | 碰到障碍物，沿视线方向往前拉 | 简单，墙角挡不住 |
| **Shot Quality Evaluation** | 先理想机位就位 → 向目标发射多条射线 → 被挡太多就换更近的位置重试 | 更自然，稍费性能 |

### Shot Quality 工作过程

```
1. 理想机位（远）
     ←─ 射线被打断 ─→ 墙壁 🧱
     📷··········❌······🧑

2. 不行，往前挪一点
     📷·······❌······🧑

3. 再往前挪
     📷····✅····🧑  ← OK，射线通畅，用这个位置
```

关键参数：

| 参数 | 含义 |
|------|------|
| **Collider Layer** | 哪些 Layer 算障碍物 |
| **Camera Radius** | 相机安全半径，避免嵌入墙体 |
| **Minimum Distance From Target** | 最近能拉到多近 |
| **Damping** | 拉近/恢复的速度 |

---

## 十二、Blend —— 镜头转场

从一台 Virtual Camera 切换到另一台时的过渡动画，让镜头不跳变。

```
不用 Blend                    用 Blend

相机A                       相机A  ───────╮
  │                           │            └────── 相机B
  └─────────┬─────────────────┘                 平滑过渡
            ↑
      啪一下跳过去
```

### 相机自带的 Blend Hint

每个 Virtual Camera 可以设置自己的 Blend Hint，告诉 Cinemachine 这台相机"该用什么方式切进来"：

| Blend Hint | 行为 | 适合场景 |
|------------|------|----------|
| **None** | 用全局默认设置 | 一般情况 |
| **Spherical Position** | 位置走**弧线**过渡 | 绕到角色另一侧 |
| **Cylindrical Position** | 走**圆柱弧线**，保持高度平滑 | 水平绕圈切机位 |
| **Screen Space Aim When Target Differs** | 目标不同时，朝向在屏幕空间里过渡 | A 看角色1，B 看角色2 |

### Brain 全局默认

Cinemachine Brain 上的 **Default Blend** 定义了默认过渡：

- **Blend Time** —— 过渡时长
- **曲线 / Easing** —— 快慢节奏（线性、缓入缓出、自定义曲线）

### Blend 过程

```
时间线：0s ───────────── Blend Time (2s) ───────────── 2s

权重：
  相机A:  100% ────────↘
                          ── 50/50 ──
  相机B:  0%  ────────────↗           ──────── 100%
```

Cinemachine 在两个相机的**最终输出位置和朝向**之间插值，不是直接改参数，保证过渡平滑。

### Custom Blend

如果需要针对特定相机之间做定制转场，用 **Cinemachine Blend List Camera**，为特定切换组合定义专属的曲线和时长。

---

## 十三、全部概念关系图

```
Cinemachine Brain（总指挥，挂 Main Camera 上）
│
├── Virtual Camera A ──── Follow + Look At
│   ├── Body（怎么跟）→ Framing Transposer
│   │   └── Dead Zone / Soft Zone / Lookahead
│   ├── Aim（怎么看）→ Composer / POV
│   ├── Noise（抖动）→ Basic Multi Channel
│   └── Collider（碰撞）→ Shot Quality
│
├── Virtual Camera B
│   └── ...
│
├── FreeLook Camera（三合一环形相机）
│
├── State-Driven Camera（跟 Animator 自动切）
│
└── Blend（A→B 的过渡曲线 + 时长）
```

---

## 附录：《双人成行》相机方案拆解

作为多目标相机的实战案例，拆解一下《双人成行》的方案。

### 同屏模式（两人靠近时）

```
┌─────────────────┐
│                 │
│   🧑      🧑   │  ← 共用一台相机
└─────────────────┘
```

| 配置项 | 选型 |
|--------|------|
| Follow | **Target Group**（包含两个角色，取中点） |
| Aim | **Group Composer**（自动算 FOV 和距离，确保两人都在画面内） |
| Body | **Framing Transposer**（带死区，两人小幅移动不抖） |

### 分屏模式（两人离远时）

```
┌──────┬──────┐
│  🧑  │  🧑  │  ← 各自独立相机
└──────┴──────┘
```

两台 Camera 各设不同的 **Viewport Rect**：

```
左边相机：Viewport Rect = (0, 0, 0.5, 1)   ← 左半屏
右边相机：Viewport Rect = (0.5, 0, 0.5, 1) ← 右半屏
```

各自挂 Cinemachine Brain，各自跟一个玩家。

> 分屏本身不是 Cinemachine 的活，需要自己写距离判断逻辑来控制分/合屏。Cinemachine 只管相机怎么动、怎么拍。

---

## 十四、UE 方案对比

UE 没有 Cinemachine，但它的相机方案同样可以逐模块对应。核心区别：UE 把很多能力直接内建到了底层组件里。

### 基本架构

```
Unity:  Camera（独立GameObject） + Cinemachine Brain
UE:     SpringArmComponent + CameraComponent（挂在 Character 上）
```

### Brain ↔ PlayerCameraManager

| Unity Cinemachine | Unreal Engine |
|------|------|
| Cinemachine Brain | **PlayerCameraManager** |
| 接收 VCam 指令，驱动真实相机 | 管理当前激活的 Camera，处理过渡 |

### Virtual Camera 对位

| Unity | UE |
|------|------|
| Virtual Camera（运行时配置） | **SpringArm + Camera** 直接在 Character 上（最常用），或放置 **CameraActor**（固定机位），或 UE5.5 的 **GameplayCameraMode**（新方案，最接近 VCam 理念） |

### Follow / Body

| Unity Cinemachine | UE 对应方案 |
|------|------|
| Transposer（固定偏移跟随） | SpringArm 默认行为 |
| Framing Transposer（死区） | SpringArm 的 **Lag** 属性（Lag Speed / Lag Max Distance） |
| Orbital Transposer（轨道旋转） | SpringArm + **AddYawInput / AddPitchInput** |
| Tracked Dolly（预设轨道） | **SplineComponent** + 沿 Spline 移动 Camera |
| Hard Lock To Target | Camera 直接挂角色头上，不用 SpringArm |

UE 没有"死区"这个概念，但 SpringArm 的 **Lag Speed** 能达到类似效果——移动小于一定速度时相机不追。

### Aim / Look At

| Unity Cinemachine | UE 对应方案 |
|------|------|
| Composer（三分法构图） | 没有内置，需在 CameraMode 里手写偏移 |
| POV（鼠标自由视角） | SpringArm + AddYawInput / AddPitchInput（标准方案） |
| Group Composer（多目标） | 需手写，取多个目标的包围框中心 |
| Hard Look At | **FindLookAtRotation** 直接算朝向 |

### Blend ↔ ViewTarget Blend

```
// UE 切换相机 —— 一行代码
CM->SetViewTargetWithBlend(NewCameraActor, 1.5f, VTBlend_EaseInOut);
```

| Unity | UE |
|------|------|
| Blend Hint + Easing Curve | **VTBlend_EaseInOut** / **VTBlend_Cubic** / **VTBlend_Linear** |
| Custom Blend List | 自定义 CameraMode 的手动混合逻辑 |

### FreeLook ↔ SpringArm + 鼠标输入

Unity FreeLook 的三 Rig 设计在 UE 中需要自己实现：

```
SpringArmComponent
  ├── TargetArmLength = 300    ← 轨道半径
  ├── bEnableCameraLag = true  ← 平滑跟随
  └── 鼠标输入：
       AddYawInput(InputAxis)     ← 水平环绕
       AddPitchInput(InputAxis)   ← 俯仰
```

> FreeLook 上中下三个 Rig 之间平滑混合在 UE 中没有内置方案，需要手写三个配置之间的插值逻辑。

### State-Driven Camera

UE 没有直接对应。通常做法是在 **AnimBP** 或 **Controller** 里监听状态变化，手动调 `SetViewTargetWithBlend` 切换相机。

### Noise ↔ CameraShake

| Unity Cinemachine | UE 对应方案 |
|------|------|
| Basic Multi Channel Noise | **CameraShake** 系统 |
| 持续噪声（走路微晃） | **CameraShakeBase** + 自定义振荡参数 |
| 爆炸震屏 | **ClientStartCameraShake(ShakeClass)** |

UE 的 CameraShake 比 Cinemachine Noise 更成熟，直接有蓝图类可配置：

```
// UE 震屏
CM->StartCameraShake(MyShakeClass);
```

CameraShake 可配置项：

- **Oscillation Duration**（持续时间）
- **Rot Oscillation**（Pitch / Yaw / Roll 各配振幅和频率）
- **Loc Oscillation**（X / Y / Z 各配振幅和频率）

### Collision ↔ SpringArm 自带

这一点 UE 比 Cinemachine 简单。SpringArmComponent 自带碰撞：

```
bDoCollisionTest = true      ← 勾上就自动做碰撞
ProbeSize = 12.0             ← 检测半径
ProbeChannel = Camera         ← 碰撞通道
```

碰墙自动缩近，离开障碍物自动恢复，不用另加组件。

### 总结对比表

| 模块 | Unity + Cinemachine | UE 原生 |
|------|------|------|
| 基础相机 | VCam + Brain | SpringArm + CameraComponent |
| 多机位切换 | VCam Priority / State-Driven | SetViewTargetWithBlend |
| 死区跟随 | Framing Transposer | SpringArm Lag |
| 轨道旋转 | Orbital Transposer / FreeLook | SpringArm + Yaw/Pitch Input |
| 构图规则 | Composer | 手写偏移 |
| 多目标 | Group Composer + Target Group | 手写逻辑 |
| 震屏 | Noise | CameraShake |
| 碰撞 | Collider Extension | SpringArm 自带 |
| 过渡转场 | Blend Hint + Curve | VTBlend 函数 |
| 预设轨道 | Tracked Dolly | Spline + 沿 Spline 移动 |

**一句话：UE 的基础设施（SpringArm、CameraShake、碰撞）更强更简单，但高级相机管理（多机位编排、自动构图、状态驱动切换）得自己写。** Unity + Cinemachine 胜在开箱即用，UE 胜在底层组件扎实。理解一边的设计理念后，另一边也能很快上手。
