# Portfólio · Leonardo Culler

Site estático de uma página só (`index.html`), sem build e sem dependências.

## Publicar no GitHub Pages

O endereço final fica **https://leoculler.github.io**.

1. O repositório é https://github.com/LeoCuller/LeoCuller.github.io (precisa ser público).
2. Na página do repositório, clique em **Add file → Upload files**, arraste o `index.html` (e este `README.md`, se quiser) e clique em **Commit changes**.
3. Vá em **Settings → Pages** e confira se **Source** está em *Deploy from a branch*, branch **main**, pasta **/ (root)**.
4. Espere de 1 a 2 minutos e abra https://leoculler.github.io.

### Pelo terminal (alternativa)

```bash
git init
git add index.html README.md
git commit -m "Portfólio"
git branch -M main
git remote add origin https://github.com/LeoCuller/LeoCuller.github.io.git
git push -u origin main
```

## Depois de publicar

- Coloque o link no seu LinkedIn (Seção **Destaques** ou no campo **Site**) e na descrição do seu perfil do GitHub.
- Para atualizar, edite o `index.html` e suba de novo; o Pages republica sozinho.
