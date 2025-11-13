# Configuração local do Kubernetes (Helm / Minikube)

Estas instruções ajudam qualquer desenvolvedor a configurar as ferramentas locais necessárias (Helm e Minikube) e a registrar os caminhos no VS Code *apenas na máquina local*.

Por que isto é local?
- Os caminhos para `helm.exe` e `minikube.exe` são diferentes em cada máquina. Manter esses caminhos no User Settings evita quebrar o ambiente de outros devs.

Instalação (Windows)

1. Instale o Minikube: https://minikube.sigs.k8s.io/docs/start/
2. Instale o Helm: https://helm.sh/docs/intro/install/

Exemplo de onde os binários podem ficar (padrões usados neste projeto)

- `C:\Users\<seu-usuario>\.vs-kubernetes\tools\minikube\windows-amd64\minikube.exe`
- `C:\Users\<seu-usuario>\.vs-kubernetes\tools\helm\windows-amd64\helm.exe`

Como aplicar nas suas configurações do VS Code (User Settings)

Abra o Command Palette (Ctrl+Shift+P) → `Preferences: Open Settings (JSON)` e cole o bloco abaixo (substitua `<seu-usuario>`):

```json
{
  "redhat.telemetry.enabled": true,
  "vs-kubernetes": {
    "vscode-kubernetes.helm-path-windows": "C:\\Users\\<seu-usuario>\\.vs-kubernetes\\tools\\helm\\windows-amd64\\helm.exe",
    "vscode-kubernetes.minikube-path-windows": "C:\\Users\\<seu-usuario>\\.vs-kubernetes\\tools\\minikube\\windows-amd64\\minikube.exe"
  }
}
```

Observações
- Não commit these User Settings into the repository. Keep them private to your machine.
- If you want, you can create scripts to install Helm/Minikube and place binaries in these paths—ask me and I can add them.
