# Kubernetes APIs

Kubernetes provides a robust API for managing your cluster. The API uses a RESTful design, allowing you to perform common actions like creating, retrieving, updating, deleting, listing, patching, and watching various resources within your cluster.

---
transition: fade-out
---

# API Groups

Kubernetes APIs are divided into groups:

1. **Core group**: Includes _Nodes_, _Pods_, _Namespaces_, _Services_, _ConfigMaps_, and _Secrets_.
2. **Named groups**: Categorize related functionalities.
   - `apps`: Manages _deployments_, _stateful sets_, _daemon sets_, and _replica sets_.
   - `batch`: Handles _jobs_ and _cron jobs_.

Each group may have multiple versions, evolving independently.

---
layout: two-cols
layoutClass: gap-16
---

# API Structure

1. **Group**: Categorizes resources based on functionality.
2. **Version**: Represents API versions within a group.
3. **Resource**: The name used in URLs (e.g., `pods`, `namespaces`).
4. **Kind**: Defines the schema of a resource type.
5. **Collection**: A list of instances of a resource type (e.g., `PodList`).
6. **Resource Instance**: An individual object in the cluster.
7. **Sub-resources**: Additional functionalities exposed within the resource URI.

```bash
kubectl api-resources
```

::right::

<p align="center">
  <img alt="Kubernetes REST Paths" src="assets/kubernetes_rest_paths.png" width="600"/>
</p>

---

# API Server & Request Flow

The API server handles all requests:

<p align="center">
  <img alt="REST post" src="assets/request_resource.png" width="600"/>
</p>

---

# Controllers & Reconciliation

Much of Kubernetes' behavior is implemented via controllers that watch API resources and reconcile desired states.

<p align="center">
  <img alt="Deployment controller" src="assets/deployment_controller.png" width="600"/>
</p>

```bash
kubectl logs -n kube-system kube-controller-manager-sveltos-management-control-plane 
```

---
layout: image-right
image: assets/kubernetes_object.png
---

# Kubernetes Objects

Every object must have:

- **`TypeMeta`**: API version and kind.
- **`metadata`**:
  - `namespace`, `name`, `uid`, `resourceVersion`, `creationTimestamp`, `deletionTimestamp`
  - `labels`, `annotations`
- **`spec`**: Desired state.
- **`status`**: Current state.

---

# Extending Kubernetes API

Kubernetes APIs are designed to be extensible. There are two primary ways to extend the API:

1. **CustomResourceDefinitions (CRDs)**: Define new resource types.
2. **API Aggregation Layer**: Forward API calls to custom API servers.

<p align="center">
  <img alt="Kube-aggregator" src="assets/extension_apiserver.png" width="600"/>
</p>

---

# Custom Resource Definitions (CRDs)

CRDs allow users to introduce new resources in Kubernetes.

```yaml
apiVersion: apiextensions.k8s.io/v1
kind: CustomResourceDefinition
metadata:
  name: databases.mycompany.com
spec:
  group: mycompany.com
  names:
    kind: Database
    plural: databases
  scope: Namespaced
  versions:
    - name: v1
      served: true
      storage: true
```

---
layout: center
class: text-center
---

# Learn More

[API Reference](https://kubernetes.io/docs/reference/kubernetes-api/) · [kubectl](https://kubernetes.io/docs/reference/kubectl/) · [RBAC](https://kubernetes.io/docs/reference/access-authn-authz/rbac/)

<PoweredBySlidev mt-10 />
