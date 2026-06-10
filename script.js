/*─── UTILS ─────────────────────── */
  const fmt = v => v.toLocaleString('pt-BR',{style:'currency',currency:'BRL',minimumFractionDigits:2});

  function updateRange(el, lblId, type) {
    const v = parseFloat(el.value);
    const min = parseFloat(el.min), max = parseFloat(el.max);
    const pct = ((v-min)/(max-min)*100).toFixed(1);
    el.style.setProperty('--pct', pct+'%');
    document.getElementById(lblId).textContent =
      type === 'currency' ? fmt(v) : v+'%';
  }

  function buildResult(panelId, rows, note) {
    const el = document.getElementById(panelId);
    el.innerHTML = `<h4>Resultado da Simulação</h4>
      <div class="result-items">
        ${rows.map((r,i) => `
          <div class="result-row ${i===0?'highlight':''}">
            <span class="rk">${r.label}</span>
            <span class="rv">${r.val}</span>
          </div>`).join('')}
      </div>
      ${note ? `<div class="result-note">${note}</div>` : ''}`;
  }

  /* ─── IMÓVEL ────────────────────── */
  function calcImovel() {
    const cred = +document.getElementById('imovel-val').value;
    const meses = +document.getElementById('imovel-prazo').value;
    const taxa = +document.getElementById('imovel-taxa').value / 100;
    const fundo = +document.getElementById('imovel-fundo').value / 100;
    const parcelaBruta = cred / meses;
    const parcelaTaxa = (cred * taxa) / meses;
    const parcelaFundo = (cred * fundo) / meses;
    const total = parcelaBruta + parcelaTaxa + parcelaFundo;
    const totalPago = total * meses;
    buildResult('res-imovel', [
      { label: 'Parcela Mensal Estimada', val: fmt(total) },
      { label: 'Valor do Crédito', val: fmt(cred) },
      { label: 'Prazo', val: meses+' meses' },
      { label: 'Total a pagar (sem lance)', val: fmt(totalPago) },
      { label: 'Taxa adm. parcela', val: fmt(parcelaTaxa) },
      { label: 'Fundo de reserva parcela', val: fmt(parcelaFundo) },
    ], '⚠️ Simulação ilustrativa. Valores finais sujeitos à aprovação cadastral. Não há cobrança de juros — apenas taxa administrativa.');
  }

  /* ─── VEÍCULO ───────────────────── */
  function calcVeiculo() {
    const cred = +document.getElementById('veiculo-val').value;
    const meses = +document.getElementById('veiculo-prazo').value;
    const taxa = +document.getElementById('veiculo-taxa').value / 100;
    const segMulti = { carro:0.015, moto:0.018, caminhao:0.012, eletrico:0.016 };
    const tipo = document.getElementById('veiculo-tipo').value;
    const seguro = cred * (segMulti[tipo] || 0.015) / meses;
    const parcBruta = cred / meses;
    const parcTaxa = (cred * taxa) / meses;
    const total = parcBruta + parcTaxa + seguro;
    buildResult('res-veiculo', [
      { label: 'Parcela Mensal Estimada', val: fmt(total) },
      { label: 'Valor do Crédito', val: fmt(cred) },
      { label: 'Prazo', val: meses+' meses' },
      { label: 'Total a pagar', val: fmt(total * meses) },
      { label: 'Taxa adm. parcela', val: fmt(parcTaxa) },
      { label: 'Seguro estimado', val: fmt(seguro) },
    ], '⚠️ Seguro obrigatório de consórcio incluso na estimativa. Simulação sem cobrança de juros.');
  }

  /* ─── SERVIÇOS ──────────────────── */
  function calcServico() {
    const cred = +document.getElementById('servico-val').value;
    const meses = +document.getElementById('servico-prazo').value;
    const taxas = { viagem:0.14, reforma:0.13, educacao:0.12, saude:0.135, casamento:0.15 };
    const cat = document.getElementById('servico-cat').value;
    const taxa = taxas[cat] || 0.14;
    const parcBruta = cred / meses;
    const parcTaxa = (cred * taxa) / meses;
    const total = parcBruta + parcTaxa;
    buildResult('res-servico', [
      { label: 'Parcela Mensal Estimada', val: fmt(total) },
      { label: 'Valor do Crédito', val: fmt(cred) },
      { label: 'Prazo', val: meses+' meses' },
      { label: 'Total a pagar', val: fmt(total * meses) },
      { label: 'Taxa adm. ('+( taxa*100).toFixed(0)+'%)', val: fmt(parcTaxa) },
    ], '✨ Crédito pode ser usado para múltiplos serviços na mesma categoria ou combinados.');
  }

  /* ─── NEGÓCIOS ──────────────────── */
  function calcNegocio() {
    const cred = +document.getElementById('negocio-val').value;
    const meses = +document.getElementById('negocio-prazo').value;
    const porteTaxa = { mei:0.155, me:0.165, medio:0.175 };
    const porte = document.getElementById('negocio-porte').value;
    const taxa = porteTaxa[porte] || 0.16;
    const parcBruta = cred / meses;
    const parcTaxa = (cred * taxa) / meses;
    const total = parcBruta + parcTaxa;
    buildResult('res-negocio', [
      { label: 'Parcela Mensal Estimada', val: fmt(total) },
      { label: 'Valor do Crédito', val: fmt(cred) },
      { label: 'Prazo', val: meses+' meses' },
      { label: 'Total a pagar', val: fmt(total * meses) },
      { label: 'Taxa adm. parcela', val: fmt(parcTaxa) },
      { label: 'Economia vs financiamento*', val: fmt(cred * 0.25) },
    ], '💼 *Estimativa de economia frente ao financiamento bancário convencional (juros ~18% a.a.).');
  }

  /* ─── RURAL ─────────────────────── */
  function calcRural() {
    const cred = +document.getElementById('rural-val').value;
    const meses = +document.getElementById('rural-prazo').value;
    const taxa = 0.145;
    const parcBruta = cred / meses;
    const parcTaxa = (cred * taxa) / meses;
    const total = parcBruta + parcTaxa;
    buildResult('res-rural', [
      { label: 'Parcela Mensal Estimada', val: fmt(total) },
      { label: 'Valor do Crédito', val: fmt(cred) },
      { label: 'Prazo', val: meses+' meses' },
      { label: 'Total a pagar', val: fmt(total * meses) },
      { label: 'Taxa adm. parcela', val: fmt(parcTaxa) },
    ], '🌾 Consórcio rural aceita como lance recursos do Pronaf e Pronamp. Consulte um especialista.');
  }

  /* ─── ENERGIA ───────────────────── */
  function calcEnergia() {
    const cred = +document.getElementById('energia-val').value;
    const meses = +document.getElementById('energia-prazo').value;
    const conta = +document.getElementById('energia-conta').value;
    const taxa = 0.13;
    const parcBruta = cred / meses;
    const parcTaxa = (cred * taxa) / meses;
    const total = parcBruta + parcTaxa;
    const economiaMensal = conta * 0.9;
    const retorno = Math.ceil(cred / economiaMensal);
    buildResult('res-energia', [
      { label: 'Parcela Mensal Estimada', val: fmt(total) },
      { label: 'Valor do Sistema', val: fmt(cred) },
      { label: 'Economia mensal estimada (90%)', val: fmt(economiaMensal) },
      { label: 'Retorno do investimento', val: retorno+' meses' },
      { label: 'Economia em '+meses+' meses', val: fmt(economiaMensal * meses) },
    ], '☀️ Estimativa de 90% de redução na conta com sistema dimensionado corretamente. Retorno médio entre 36–60 meses.');
  }

  /* ─── TABS ──────────────────────── */
  function switchTab(name) {
    document.querySelectorAll('.sim-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.sim-panel').forEach(p => p.classList.remove('active'));
    event.target.classList.add('active');
    document.getElementById('sim-'+name).classList.add('active');
  }

  function showSim(name) {
    document.getElementById('simuladores').scrollIntoView({ behavior: 'smooth' });
    setTimeout(() => {
      document.querySelectorAll('.sim-tab').forEach((t, i) => {
        const tabs = ['imovel','veiculo','servico','negocio','rural','energia'];
        t.classList.toggle('active', tabs[i] === name);
      });
      document.querySelectorAll('.sim-panel').forEach(p => p.classList.remove('active'));
      document.getElementById('sim-'+name).classList.add('active');
    }, 600);
  }

  /* ─── SCROLL REVEAL ─────────────── */
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); } });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

  /* ─── HAMBURGER ─────────────────── */
  function toggleMenu() {
    const links = document.querySelector('.nav-links');
    links.style.display = links.style.display === 'flex' ? 'none' : 'flex';
    links.style.flexDirection = 'column';
    links.style.position = 'absolute';
    links.style.top = '68px'; links.style.left = '0'; links.style.right = '0';
    links.style.background = 'rgba(26,6,48,0.98)';
    links.style.padding = '1.5rem 5%';
  }

  /* init range fills */
  document.querySelectorAll('input[type=range]').forEach(r => {
    const pct = ((r.value - r.min)/(r.max - r.min)*100).toFixed(1);
    r.style.setProperty('--pct', pct+'%');
  });