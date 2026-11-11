# Portal Cursos Concursos

Site para venda de cursos de concursos públicos (segmentos Fiscal e Tribunais) com acesso via Google Drive.

## Tecnologias

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Lucide React

## Estrutura

- `/` - Página inicial
- `/cursos` - Catálogo de cursos
- `/cursos/[slug]` - Detalhe do curso
- `/checkout` - Checkout com PIX
- `/minha-conta` - Área do cliente
- `/admin/dashboard` - Painel administrativo (apenas 2 e-mails)
- `/api/cursos` - API de cursos
- `/api/checkout` - API de checkout
- `/api/orders` - API de pedidos

## Deploy no Vercel

1. Importe este repositório no Vercel
2. Configure as variáveis de ambiente se necessário
3. Deploy automático

## Configuração

Edite `src/lib/data.ts` com:
- Chave PIX e dados do beneficiário
- IDs das pastas do Google Drive
- E-mails dos administradores
