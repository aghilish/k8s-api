---
theme: seriph
title: Kubernetes API Overview
background: assets/k8s-api-bg-1.jpg
info: |
  ## Kubernetes API Deep Dive
  A presentation on Kubernetes API architecture and learn how to interact with it.

  Learn more at [Kubernetes Docs](https://kubernetes.io/docs/reference/kubernetes-api/)
class: text-center
transition: slide-left
hideInToc: true
---

# Kubernetes API

Understand how Kubernetes API works and how to interact with it.

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/aghilish" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
  <a href="https://www.linkedin.com/in/aghilish/" target="_blank" class="slidev-icon-btn">
    <carbon:logo-linkedin />
  </a>
</div>
<!-- 
Welcome to the Kubernetes API Overview presentation. In this session, we will dive deep into Extending the Kubernetes API and Focus on Custom Resource Definitions (CRDs).
-->
---
transition: fade-out
hideInToc: true
---

# Agenda
<div v-click>
<Toc text-sm minDepth="1" maxDepth="1" />
</div>
<!--
Today, we'll cover the following topics:
First, we'll explore extending the Kubernetes API, followed by API aggregation. Next, we'll introduce Kubebuilder and guide you through creating your own API. We'll discuss marker comments and automation, then dive into defining the spec and status in a Custom Resource Definition, or CRD. After that, we'll show how to make custom resources work with client-go and explore choosing the right resource scope. We'll also cover designing the CRD spec, understanding the status subresource, and installing the CRD. Finally, we'll touch on the Common Expression Language, additional printer columns, validation ratcheting, and wrap up with final remarks.
Let’s get started!
-->

<!-- 
Here is the agenda for today's presentation. We will cover the Kubernetes API architecture, how to interact with the API, API groups and versions, and the Kubernetes object model.
-->