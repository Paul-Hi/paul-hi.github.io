---
layout: project-cards
title: Transmittance-based Visibility and Viewpoint Optimization
type: Research
icon: <i class="fa-solid fa-building-columns"></i>
image: assets/images/paperBG.png
---

<div class="mx-auto">
Paul Himmler<sup>1</sup>, Tobias Günther<sup>1</sup>
<br>
Friedrich-Alexander-Universität Erlangen-Nürnberg<sup>1</sup>
<br>
<b>EuroVis 2024 (Under Review)</b>
</div>

<div class="btn-group btn-group-sm mx-auto mt-2 mb-5" role="group">
    <button class="btn btn-secondary mx-1"><i class="fa-regular fa-file-pdf"></i> Paper</button>
    <button class="btn btn-secondary mx-1"><i class="fa-regular fa-file-video"></i> Video</button>
    <button class="btn btn-secondary mx-1"><i class="fa-solid fa-code"></i> Code</button>
</div>

##### Abstract

A long-standing challenge in volume visualization is the effective communication of relevant spatial structures that might be hidden due to occlusions. Given a scalar field that indicates the importance of every point in the domain, previous work synthesized volume visualizations by weighted averaging of samples along view rays or by optimizing the extinction through an energy minimization. The contribution of an individual sample to the final pixel color is determined by the so-called transmittance, which, however, has previously not been part of the objective function. In this paper, we propose to measure the visibility of relevant structures directly by incorporating the transmittance into a non-linear energy minimization. For the first time, we not only perform a transmittance-based visibility optimization, we concurrently optimize the camera position to find ideal viewpoints. We derive the partial derivatives for the gradient-based optimization symbolically, which makes the application of automatic differentiation methods unnecessary. The transmittance-based formulation gives a direct visibility measure that is communicated to the user in order to make aware of potentially overlooked relevant structures. Our approach is compatible with any measure of importance and its versatility is demonstrated in multiple data sets.

##### Visual Summary (Images, Videos, Short Descriptions)

##### Acknowledgements

##### BibTex

    @article{}
