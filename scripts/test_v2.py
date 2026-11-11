"""Testes do site v2 (quiz, larguras de celular, seções, prints). Uso: python scripts/test_v2.py [URL] [pasta-de-prints]
Sem URL, serve a pasta dist/ num servidor local. As chamadas ao back-end sao simuladas (route) para testar os destinos do quiz;
um caso roda sem simulacao para conferir a regra local de reserva."""
import json, os, re, subprocess, sys, threading, time
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from playwright.sync_api import sync_playwright

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = sys.argv[2] if len(sys.argv) > 2 else os.path.join(os.environ.get("TEMP", "."), "site_v2")
os.makedirs(OUT, exist_ok=True)
falhas = []
def ok(cond, msg):
    print(("ok   " if cond else "FALHA") + " " + msg)
    if not cond: falhas.append(msg)

def servir():
    class H(SimpleHTTPRequestHandler):
        def __init__(self, *a, **k): super().__init__(*a, directory=os.path.join(RAIZ, "dist"), **k)
        def log_message(self, *a): pass
        def do_GET(self):
            # formato "directory": /x -> /x/index.html
            p = self.path.split("?")[0]
            if not os.path.splitext(p)[1] and not p.endswith("/") and os.path.isdir(os.path.join(RAIZ, "dist", p.strip("/"))):
                self.path = p + "/"
            return super().do_GET()
    srv = ThreadingHTTPServer(("127.0.0.1", 8098), H)
    threading.Thread(target=srv.serve_forever, daemon=True).start()
    return "http://127.0.0.1:8098"

URL = sys.argv[1] if len(sys.argv) > 1 and sys.argv[1] else servir()
API = "https://user.rangeltech.net"

def mock(ctx, destino):
    """Simula o back-end: cria lead, grava, conclui com o destino pedido."""
    def rota(route, req):
        u = req.url
        if u.endswith("/api/quiz") and req.method == "POST":
            return route.fulfill(status=200, content_type="application/json", body=json.dumps({"token": "tok123"}))
        if "/api/quiz/tok123/concluir" in u:
            urls = {"agenda": API + "/agendar?t=tok123", "checkout": "https://pay.cakto.com.br/qddg2xq", "whatsapp": "https://wa.me/5562985613482?text=oi", "obrigado": ""}
            res = {"agenda": "cara_a_cara", "checkout": "whatsapp", "whatsapp": "empresa", "obrigado": "frio"}[destino]
            return route.fulfill(status=200, content_type="application/json", body=json.dumps({"resultado": res, "quente": destino != "obrigado", "destino": {"tipo": destino, "url": urls[destino]}, "resumo": {}}))
        if "/api/quiz/tok123" in u:
            return route.fulfill(status=200, content_type="application/json", body=json.dumps({"ok": True, "respostas": {}}))
        return route.continue_()
    ctx.route(API + "/**", rota)

def preencher_contato(pg):
    pg.fill("input[name=nome]", "Teste Playwright")
    pg.fill("input[name=whatsapp]", "62985613482")
    pg.fill("input[name=email]", "teste@example.com")
    pg.click("[data-submit]")

def quiz_pessoa(pg, formato="cara_a_cara", prazo="30dias"):
    pg.click("[data-quiz][data-situacao=empregado]")
    pg.wait_for_selector("dialog[open] .quiz__opt")
    ok(pg.locator("[data-quiz-step]").inner_text().startswith("2 de"), "quiz pulou a situação já escolhida no hero")
    pg.click(".quiz__opt[data-opt=saas]")
    pg.wait_for_selector("[data-next]"); pg.click("[data-next]")
    pg.wait_for_selector("input[name=nome]"); preencher_contato(pg)
    pg.wait_for_selector("textarea[name=problema]"); pg.fill("textarea[name=problema]", "Quero um SaaS que responda clientes no WhatsApp"); pg.click("[data-submit]")
    pg.wait_for_selector("textarea[name=tentou]"); pg.click("[data-skip]")
    pg.wait_for_selector(".quiz__opt[data-opt='2000a10000']"); pg.click(".quiz__opt[data-opt='2000a10000']")
    pg.wait_for_selector(f".quiz__opt[data-opt='{prazo}']"); pg.click(f".quiz__opt[data-opt='{prazo}']")
    pg.wait_for_selector(f".quiz__opt[data-opt='{formato}']"); pg.check("[data-compromisso]"); pg.click(f".quiz__opt[data-opt='{formato}']")
    pg.wait_for_selector(".quiz__q", timeout=8000)

with sync_playwright() as p:
    b = p.chromium.launch()
    erros = []
    # ---- desktop: seções, prints
    ctx = b.new_context(viewport={"width": 1366, "height": 800})
    pg = ctx.new_page()
    pg.on("console", lambda m: m.type == "error" and "user.rangeltech.net" not in m.text and erros.append(m.text))
    pg.on("pageerror", lambda e: erros.append(str(e)))
    pg.goto(URL, wait_until="networkidle"); pg.wait_for_timeout(1500)
    pg.screenshot(path=f"{OUT}/d_hero.jpg", quality=70, type="jpeg")
    secs = [s.get_attribute("data-sec") for s in pg.query_selector_all("[data-sec]")]
    for s in ["hero", "sobre", "custo", "caminhos", "como", "prova", "projetos", "garantia", "perguntas", "final"]:
        ok(s in secs, f"seção {s} presente")
    ok(not pg.query_selector("[data-fab]"), "sem botão flutuante do WhatsApp")
    ok("ficticio" not in pg.content().lower() and "fictício" not in pg.content().lower(), "nada de 'fictício' no HTML")
    ok("R$ 391" not in pg.content() and "habilidades técnicas" not in pg.content(), "sem o bônus antigo de curso")
    ok(pg.locator("text=R$ 294").count() == 0, "sem o produto de R$ 294")
    h = pg.evaluate("document.body.scrollHeight")
    for y in range(0, h, 500):
        pg.evaluate(f"window.scrollTo(0,{y})"); pg.wait_for_timeout(90)
    pg.wait_for_timeout(800)
    for s in ["caminhos", "como", "prova", "projetos", "perguntas"]:
        pg.evaluate(f"document.querySelector('[data-sec=\"{s}\"]').scrollIntoView({{block:'start'}})"); pg.wait_for_timeout(1400)
        pg.screenshot(path=f"{OUT}/d_{s}.jpg", quality=65, type="jpeg")
    # cena 3D carregou?
    pg.evaluate("document.querySelector('[data-sec=como]').scrollIntoView({block:'center'})"); pg.wait_for_timeout(3500)
    ok(pg.evaluate("document.querySelectorAll('canvas[data-cerebro]').length >= 3 && document.querySelector('canvas[data-cerebro=hero]').width > 100"), "cérebro montado (hero, como, final)")
    pg.screenshot(path=f"{OUT}/d_3d.jpg", quality=70, type="jpeg")
    ok(pg.evaluate("document.querySelectorAll('.map .pt').length") > 50, "mapa com pontos vindos da prova")
    ctx.close()

    # ---- quiz com back-end simulado: 4 destinos
    for destino in ["agenda", "checkout", "whatsapp", "obrigado"]:
        ctx = b.new_context(viewport={"width": 1366, "height": 800}); mock(ctx, destino)
        pg = ctx.new_page(); pg.on("pageerror", lambda e: erros.append(str(e)))
        pg.goto(URL, wait_until="networkidle")
        if destino == "whatsapp":
            pg.click("[data-quiz][data-situacao=empresa]")
            pg.wait_for_selector("dialog[open] .quiz__opt"); pg.click(".quiz__opt[data-opt=atendimento]")
            pg.wait_for_selector("[data-next]"); pg.click("[data-next]")
            pg.wait_for_selector("input[name=nome]"); preencher_contato(pg)
            pg.wait_for_selector("textarea[name=problema]"); pg.fill("textarea[name=problema]", "Atendimento não dá conta dos pedidos"); pg.click("[data-submit]")
            pg.wait_for_selector(".quiz__opt[data-opt='11a50']"); pg.click(".quiz__opt[data-opt='11a50']")
            pg.wait_for_selector(".quiz__opt[data-opt=sim]"); pg.click(".quiz__opt[data-opt=sim]")
            pg.wait_for_selector(".quiz__opt[data-opt='6000a12000']"); pg.click(".quiz__opt[data-opt='6000a12000']")
            pg.wait_for_selector(".quiz__opt[data-opt='30dias']"); pg.click(".quiz__opt[data-opt='30dias']")
            pg.wait_for_selector(".quiz__q", timeout=8000)
            ok("por ano" in pg.inner_text("dialog[open] .quiz__body") and "144.000" in pg.inner_text("dialog[open] .quiz__body"), "empresa: conta anual no resultado")
        else:
            quiz_pessoa(pg, "cara_a_cara" if destino == "agenda" else "whatsapp", "pesquisando" if destino == "obrigado" else "30dias")
        pg.wait_for_timeout(300)
        a = pg.query_selector("dialog[open] .quiz__body a.btn, dialog[open] .quiz__body button.btn")
        href = a.get_attribute("href") if a else ""
        esperado = {"agenda": "/agendar?t=tok123", "checkout": "pay.cakto.com.br", "whatsapp": "wa.me", "obrigado": None}[destino]
        ok(a is not None and (esperado is None or esperado in (href or "")), f"destino {destino}: botão certo ({href})")
        pg.screenshot(path=f"{OUT}/q_{destino}.jpg", quality=70, type="jpeg")
        ctx.close()

    # ---- quiz SEM back-end (regra local): cara a cara + 30 dias -> WhatsApp
    ctx = b.new_context(viewport={"width": 1366, "height": 800})
    ctx.route(API + "/**", lambda r, q: r.abort())
    pg = ctx.new_page(); pg.goto(URL, wait_until="networkidle")
    quiz_pessoa(pg, "cara_a_cara", "semana")
    a = pg.query_selector("dialog[open] .quiz__body a.btn")
    ok(a is not None and "wa.me" in (a.get_attribute("href") or ""), "sem API: cara a cara cai no WhatsApp com as respostas")
    ctx.close()

    # ---- celular: largura de layout igual à pedida e sem rolagem lateral
    for w in [320, 360, 375, 390, 414]:
        ctx = b.new_context(viewport={"width": w, "height": 760}, device_scale_factor=2, is_mobile=True, has_touch=True)
        pg = ctx.new_page(); pg.on("pageerror", lambda e: erros.append(str(e)))
        pg.goto(URL, wait_until="networkidle"); pg.wait_for_timeout(800)
        iw, sw = pg.evaluate("[innerWidth, document.documentElement.scrollWidth]")
        ok(iw == w and sw <= w, f"celular {w}px: innerWidth={iw} scrollWidth={sw}")
        if w == 390:
            pg.screenshot(path=f"{OUT}/m_hero.jpg", quality=70, type="jpeg")
            for s in ["caminhos", "como", "prova"]:
                pg.evaluate(f"document.querySelector('[data-sec=\"{s}\"]').scrollIntoView({{block:'start'}})"); pg.wait_for_timeout(1200)
                pg.screenshot(path=f"{OUT}/m_{s}.jpg", quality=65, type="jpeg")
            pg.evaluate("window.scrollTo(0,0)"); pg.wait_for_timeout(300)
            pg.click("[data-quiz][data-situacao=autonomo]"); pg.wait_for_selector("dialog[open] .quiz__opt"); pg.wait_for_timeout(400)
            pg.screenshot(path=f"{OUT}/m_quiz.jpg", quality=70, type="jpeg")
            qiw = pg.evaluate("document.querySelector('dialog[open] .quiz__card').getBoundingClientRect().width")
            ok(abs(qiw - w) < 2, f"quiz ocupa a tela toda no celular ({qiw})")
        ctx.close()
    b.close()
    ok(not erros, "sem erros de JavaScript: " + (erros[0][:160] if erros else ""))

print(f"\n{len(falhas)} falha(s). Prints em {OUT}")
sys.exit(1 if falhas else 0)
