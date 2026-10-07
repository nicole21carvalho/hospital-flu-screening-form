const form = document.getElementById('triagem');
const campoCpf = document.getElementById('cpf');
const campoTelefone = document.getElementById('telefone');
const campoNascimento = document.getElementById('nascimento');
const campoDoencas = document.getElementById('campo-doencas');
const textoDoencas = document.getElementById('doencas');
const sintomas = [...document.querySelectorAll('input[name="sintomas"]')];
const erroSintomas = document.getElementById('erro-sintomas');
const alertaFaltaDeAr = document.getElementById('alerta-ar');
const resumo = document.getElementById('resumo');

campoNascimento.max = new Date().toISOString().slice(0, 10);

// ---------- Máscaras ----------

campoCpf.addEventListener('input', () => {
  campoCpf.value = mascararCpf(campoCpf.value);
  validarCpf();
});

campoTelefone.addEventListener('input', () => {
  campoTelefone.value = mascararTelefone(campoTelefone.value);
});

// ---------- Campos condicionais ----------

form.addEventListener('change', (evento) => {
  if (evento.target.name === 'doenca') {
    const temDoenca = evento.target.value === 'sim';
    campoDoencas.hidden = !temDoenca;
    textoDoencas.required = temDoenca;
    if (temDoenca) textoDoencas.focus();
  }

  if (evento.target.name === 'sintomas') {
    alertaFaltaDeAr.hidden = !sintomas.some((s) => s.checked && s.dataset.alerta);
    validarSintomas();
  }
});

// ---------- Validação ----------

function validarCpf() {
  campoCpf.setCustomValidity(cpfValido(campoCpf.value) ? '' : 'CPF inválido');
}

function validarNascimento() {
  campoNascimento.setCustomValidity(nascimentoValido(campoNascimento.value) ? '' : 'Data inválida');
}

function validarSintomas() {
  const algumMarcado = sintomas.some((s) => s.checked);
  erroSintomas.hidden = algumMarcado || !form.classList.contains('was-validated');
  return algumMarcado;
}

// ---------- Envio ----------

form.addEventListener('submit', (evento) => {
  evento.preventDefault();
  validarCpf();
  validarNascimento();
  form.classList.add('was-validated');

  const sintomasOk = validarSintomas();
  if (!form.checkValidity() || !sintomasOk) {
    form.querySelector(':invalid')?.focus();
    return;
  }

  mostrarResumo(new FormData(form));
});

form.addEventListener('reset', () => {
  form.classList.remove('was-validated');
  campoDoencas.hidden = true;
  textoDoencas.required = false;
  alertaFaltaDeAr.hidden = true;
  erroSintomas.hidden = true;
});

function mostrarResumo(dados) {
  const doenca = dados.get('doenca') === 'sim' ? dados.get('doencas') : 'Nenhuma';
  const dias = dados.get('inicio');
  const itens = [
    ['Nome', dados.get('nome')],
    ['CPF', dados.get('cpf')],
    ['Idade', `${calcularIdade(dados.get('nascimento'))} anos`],
    ['Doenças pré-existentes', doenca],
    ['Sintomas', dados.getAll('sintomas').join(', ')],
    ['Início dos sintomas', dias === '' ? 'Não informado' : `Há ${dias} dia(s)`],
  ];

  const lista = document.getElementById('resumo-dados');
  lista.replaceChildren(
    ...itens.flatMap(([rotulo, valor]) => {
      const dt = document.createElement('dt');
      dt.className = 'col-sm-5 text-body-secondary fw-normal';
      dt.textContent = rotulo;
      const dd = document.createElement('dd');
      dd.className = 'col-sm-7';
      dd.textContent = valor;
      return [dt, dd];
    })
  );

  form.hidden = true;
  resumo.hidden = false;
  resumo.focus();
}

document.getElementById('nova-triagem').addEventListener('click', () => {
  form.reset();
  resumo.hidden = true;
  form.hidden = false;
  document.getElementById('nome').focus();
});
