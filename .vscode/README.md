## Workspace settings (project-wide)

Este diretório contém apenas as configurações que *devem* ser partilhadas entre todos que trabalham neste repositório.

- `settings.json` — configurações por projeto (formatters, assistentes de código, IDs de serviços que precisam ser consistentes entre a equipe).

Boas práticas adotadas aqui

- Valores específicos da máquina (caminhos absolutos, telemetria, tokens) NÃO devem ser colocados neste arquivo. Estes devem permanecer nas configurações de usuário do VS Code (User Settings).
- Se você precisar padronizar uma configuração sensível (ex.: usar um project ID), prefira documentar claramente e concordar com o time antes de comitar.

Se precisar configurar ferramentas locais (Helm / Minikube), siga as instruções no `docs/k8s-setup.md`.
