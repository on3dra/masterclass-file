Nasaď aktuální projekt na internet. Proveď tyto kroky:

1. `git add .` — přidej všechny změny
2. `git commit -m "[popis změny]"` — commitni s popisem co se změnilo (vygeneruj popis sám z diffů)
3. `git push origin main` — nahraj na GitHub
4. `npx vercel --prod` — nasaď na Vercel do produkce
5. Vypiš URL nasazeného projektu

Pokud git repozitář ještě neexistuje, vytvoř ho:
- `git init`
- `gh repo create [nazev-projektu] --public --source=. --push`

Pokud Vercel projekt ještě neexistuje, proveď první nastavení pomocí `npx vercel` a odpověz na výzvy.
