---
layout: project-cards
title: Conformal First Passage for Epsilon-free Walk-on-Spheres
type: Research
icon: <i class="fa-solid fa-building-columns"></i>
image: assets/images/siggraph25/paperBG.png
---

<div class="mx-auto">
Paul Himmler, Tobias Günther
<br>
Friedrich-Alexander-Universität Erlangen-Nürnberg
<br>
<b>
ACM Transactions on Graphics (SIGGRAPH), 2025</b>
</div>

<div class="btn-group btn-group-sm mx-auto mt-2 mb-5" role="group">
    <a class="btn btn-secondary mx-1" href="conformal_first_passage.html"><i class="fa-regular fa-window-maximize"></i> Project Page</a>
</div>

In recent years, grid-free Monte Carlo methods have gained increasing popularity for solving fundamental partial differential equations. For a given point in the domain, the Walk-on-Spheres method solves a boundary integral equation by integrating recursively over the largest possible sphere. When the walks approach boundaries with Dirichlet conditions, the number of path vertices increases considerably, since the step size becomes smaller with decreasing distance to the boundary. In practice, the walks are terminated once they reach an epsilon-shell around the boundary. This, however, introduces bias, leading to a trade-off between accuracy and performance. Instead of using spheres, we propose to utilize geometric primitives that share more than one point with the boundary to increase the likelihood of immediately terminating. Along the boundary of those new geometric primitives a sampling probability is needed, which corresponds to the exit probability of a Brownian motion. This is known as a first passage problem. Utilizing that Laplace equations are invariant under conformal maps, we transform exit points from unit circles to the exit points of our geometric primitives, for which we describe a suitable placement strategy. With this, we obtain a novel approach to solve the Laplace equation in two dimensions, which does not require an epsilon-shell, significantly reduces the number of path vertices, and reduces inaccuracies near Dirichlet boundaries.
