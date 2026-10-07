// Funções puras de validação e formatação, sem depender da página.

function somenteDigitos(texto) {
  return texto.replace(/\D/g, '');
}

// Valida o CPF pelos dois dígitos verificadores.
function cpfValido(cpf) {
  const digitos = somenteDigitos(cpf);
  if (digitos.length !== 11 || /^(\d)\1{10}$/.test(digitos)) return false;

  const calcularDigito = (quantidade) => {
    let soma = 0;
    for (let i = 0; i < quantidade; i++) {
      soma += Number(digitos[i]) * (quantidade + 1 - i);
    }
    const resto = (soma * 10) % 11;
    return resto === 10 ? 0 : resto;
  };

  return calcularDigito(9) === Number(digitos[9]) && calcularDigito(10) === Number(digitos[10]);
}

function mascararCpf(valor) {
  return somenteDigitos(valor)
    .slice(0, 11)
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
}

function mascararTelefone(valor) {
  const digitos = somenteDigitos(valor).slice(0, 11);
  if (digitos.length <= 2) return digitos.replace(/(\d{1,2})/, '($1');
  if (digitos.length <= 6) return digitos.replace(/(\d{2})(\d+)/, '($1) $2');
  if (digitos.length <= 10) return digitos.replace(/(\d{2})(\d{4})(\d+)/, '($1) $2-$3');
  return digitos.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
}

// Data de nascimento válida: não pode ser no futuro nem há mais de 130 anos.
function nascimentoValido(dataIso, hoje = new Date()) {
  const data = new Date(dataIso + 'T00:00:00');
  if (Number.isNaN(data.getTime())) return false;
  const limite = new Date(hoje);
  limite.setFullYear(limite.getFullYear() - 130);
  return data <= hoje && data >= limite;
}

function calcularIdade(dataIso, hoje = new Date()) {
  const nascimento = new Date(dataIso + 'T00:00:00');
  let idade = hoje.getFullYear() - nascimento.getFullYear();
  const aindaNaoFezAniversario =
    hoje.getMonth() < nascimento.getMonth() ||
    (hoje.getMonth() === nascimento.getMonth() && hoje.getDate() < nascimento.getDate());
  return aindaNaoFezAniversario ? idade - 1 : idade;
}

if (typeof module !== 'undefined') {
  module.exports = { cpfValido, mascararCpf, mascararTelefone, nascimentoValido, calcularIdade };
}
