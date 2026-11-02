---
layout: project-cards
title: Visibility Optimization for Direct and Indirect Volume Rendering using Level Set Propagation
image: assets/images/tvcg26/paperBG.webp
category: publication
subcategory: journal
venue: "IEEE Transactions on Visualization and Computer Graphics, 2026"
badge: "TVCG 2026"
authors: "Paul Himmler, Tobias Günther"
summary: "Joint visibility optimization in direct and indirect volume rendering by evolving implicit geometry to reveal user-selected structures."
project_url: "vis_opt_direct_indirect.html"
pdf_url: "https://vc.tf.fau.de/publications/Himmler26TVCG/Himmler26TVCG.pdf"
doi_url: "https://doi.org/10.1109/TVCG.2026.3668520"
---

<div class="mx-auto">
Paul Himmler, Tobias Günther
<br>
Friedrich-Alexander-Universität Erlangen-Nürnberg
<br>
<b>
IEEE Transactions on Visualization and Computer Graphics, 2026</b>
</div>

<div class="btn-group btn-group-sm mx-auto mt-2 mb-5" role="group">
    <a class="btn btn-secondary mx-1" href="vis_opt_direct_indirect.html"><i class="fa-regular fa-window-maximize"></i> Project Page</a>
</div>

Volumetric data arises in many scientific disciplines, describing the tissue in our body, the composition of the Earth, or the distribution of matter in the universe, to name a few. Such volume data is commonly visualized with direct methods such as ray marching, and with indirect methods such as isocontours. The combination of these approaches is fruitful to provide context and to enhance depth perception. A common challenge, however, is that three-dimensional data inherently leads to occlusions, for which visibility optimization techniques have been employed in the past. The joint visibility optimization of volumetric data (direct volume rendering) and surface geometry (indirect volume rendering) is challenging. With this paper, we provide an optimization approach in which explicit and implicit geometry, such as isocontours or closed context geometry, as well as the volume itself give way to reveal structures that have been identified as important by a user. We model the geometry implicitly as level set of a signed distance field, which is evolved under a normal flow to reduce the occlusion. The non-linear optimization involves gradient descent solvers, level set propagation, and multi-grid optimization. We compare our approach to previous visibility optimizations.
