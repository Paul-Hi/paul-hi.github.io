---
layout: project-cards
title: "Mango: Graphics Playground/Engine"
image: assets/images/mangoBG.webp
category: project
badge: "Graphics Engine"
summary: "Compact real-time rendering framework exploring physically based rendering techniques and rendering architecture."
code_url: "https://github.com/Paul-Hi/Mango"
---

<div class="btn-group btn-group-sm mx-auto mt-2 mb-5" role="group">
    <a class="btn btn-secondary mx-1" href="https://github.com/Paul-Hi/Mango"><i class="fa-solid fa-code"></i> Code</a>
</div>

##### Details

Mango is an Open Source Framework. Or at least it should be in the future. A playground for people like me.

Just to be clear: This is not the first attempt! I plan to implement various features, with main focus on computer graphics. A few of them are described below, but there will be added a lot more in the future. There should also always be a documentation and tests to ensure cleaner and more functional code.

##### Features

Building and running on Linux and Windows.

Basic support of GLTF models (No animations yet, some features missing, no draco encoding)

HDR support and image based lighting

Directional light with Cascaded Shadow Mapping

Basic GUI with DearImGui with widgets

Many physically based rendering features

Deferred rendering with OpenGL backend

Entity Component System

Basic framework architecture

Editor featuring .gltf and .hdr file loading and a simple camera controller

Profiling with [Tracy](https://github.com/wolfpld/tracy)
