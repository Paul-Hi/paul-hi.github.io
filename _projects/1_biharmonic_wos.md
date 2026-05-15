---
layout: project-cards
title: Monte Carlo Rendering of Biharmonic Diffusion Curves
type: Journal Paper SIGGRAPH
icon: <i class="fa-solid fa-building-columns"></i>
image: assets/images/siggraph26/paperBG.png
---

<div class="mx-auto">
Paul Himmler, Tobias Günther
<br>
Friedrich-Alexander-Universität Erlangen-Nürnberg
<br>
<b>
ACM Transactions on Graphics (SIGGRAPH), 2026</b>
</div>

<div class="btn-group btn-group-sm mx-auto mt-2 mb-5" role="group">
    <a class="btn btn-secondary mx-1" href="biharmonic_wos.html"><i class="fa-regular fa-window-maximize"></i> Project Page</a>
</div>

Stochastic Monte Carlo solvers for partial differential equations (PDEs) recently gained popularity in computer graphics, finding applications in geometry processing, rendering, simulation, and visualization. At present, there exists no Monte Carlo solver for the rendering of biharmonic diffusion curves, an artist-friendly smooth vector graphics primitive. The fourth-order biharmonic equation of biharmonic diffusion curves can be split into two second-order PDEs, namely a Laplace and a Poisson equation. However, since biharmonic diffusion curves set Dirichlet and inhomogeneous Neumann conditions at the same time, these two second-order PDEs are tightly coupled and can hence not be solved directly. We propose to treat the rendering of biharmonic diffusion curves as an inverse problem, in which the Dirichlet data of the Laplace equation is unknown. We formulate a variational energy optimization, such that the user-defined boundary conditions are met. Thereby, the necessary gradients are estimated stochastically by solving two second-order problems with Dirichlet boundary conditions only.
