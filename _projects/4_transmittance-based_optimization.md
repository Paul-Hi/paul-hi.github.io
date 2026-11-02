---
layout: project-cards
title: Transmittance-based Extinction and Viewpoint Optimization
image: assets/images/eurovis24/paperBG.webp
category: publication
subcategory: journal
venue: "Computer Graphics Forum (Proc. EuroVis), 2024"
badge: "EuroVis 2024"
authors: "Paul Himmler, Tobias Günther"
summary: "Concurrent transmittance-based extinction and viewpoint optimization via non-linear energy minimization incorporating visibility measures of relevant structures in volumetric data."
project_url: "transmittance-based_extinction_and_viewpoint_optimization.html"
pdf_url: "https://vc.tf.fau.de/publications/Himmler24EuroVis/Himmler24EuroVis.pdf"
video_url: "https://vc.tf.fau.de/publications/Himmler24EuroVis/Himmler24EuroVis.mp4"
doi_url: "https://doi.org/10.1111/cgf.15096"
---

<div class="mx-auto">
Paul Himmler, Tobias Günther
<br>
Friedrich-Alexander-Universität Erlangen-Nürnberg
<br>
<b>
Computer Graphics Forum (Proc. EuroVis) 2024</b>
</div>

<div class="btn-group btn-group-sm mx-auto mt-2 mb-5" role="group">
    <a class="btn btn-secondary mx-1" href="transmittance-based_extinction_and_viewpoint_optimization.html"><i class="fa-regular fa-window-maximize"></i> Project Page</a>
</div>

A long-standing challenge in volume visualization is the effective communication of relevant spatial structures that might be hidden due to occlusions. Given a scalar field that indicates the importance of every point in the domain, previous work synthesized volume visualizations by weighted averaging of samples along view rays or by optimizing a spatially-varying extinction field through an energy minimization. This energy minimization, however, did not directly measure the contribution of an individual sample to the final pixel color. In this paper, we measure the visibility of relevant structures directly by incorporating the transmittance into a non-linear energy minimization. For the first time, we not only perform a transmittance-based extinction optimization, we concurrently optimize the camera position to find ideal viewpoints. We derive the partial derivatives for the gradient-based optimization symbolically, which makes the application of automatic differentiation methods unnecessary. The transmittance-based formulation gives a direct visibility measure that is communicated to the user in order to make aware of potentially overlooked relevant structures. Our approach is compatible with any measure of importance and its versatility is demonstrated in multiple data sets.
