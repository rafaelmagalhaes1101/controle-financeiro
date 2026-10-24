# Meu Controle Financeiro (Firebase + Vercel)

Site estático (sem build). Dados salvos no Firestore, login com Google. Cada conta só enxerga os próprios dados.

## 1. Firebase
1. Em console.firebase.google.com, crie um projeto.
2. **Authentication > Sign-in method**: ative **Google**.
3. **Firestore Database > Criar banco de dados** (modo produção). Na aba **Regras**, cole o conteúdo de `firestore.rules` e publique.
4. **Configurações do projeto > Seus apps > Web (</>)**: registre um app e copie o `firebaseConfig`.
5. Cole os valores em `firebase-config.js`.

## 2. Vercel
Opção A (GitHub): suba esta pasta em um repositório, depois em vercel.com > Add New > Project, importe o repositório. Framework Preset: **Other**. Sem build command e sem output directory. Deploy.

Opção B (terminal): dentro da pasta, rode `npx vercel` e depois `npx vercel --prod`.

## 3. Liberar o domínio no login
Depois do deploy, em Firebase > Authentication > Configurações > **Domínios autorizados**, adicione o domínio da Vercel (ex.: `meu-site.vercel.app`). Sem isso, o login com Google falha.

## Migrar dados do site antigo
No site antigo, Ajustes > Exportar backup (JSON), copie o texto e salve como `backup.json`. No site novo, Ajustes > Importar backup.
