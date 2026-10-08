// Rode com: node --test
const { test } = require('node:test');
const assert = require('node:assert/strict');
const {
  cpfValido, mascararCpf, mascararTelefone, nascimentoValido, calcularIdade,
} = require('./validacao.js');

test('aceita CPFs com dígitos verificadores corretos', () => {
  assert.equal(cpfValido('529.982.247-25'), true);
  assert.equal(cpfValido('52998224725'), true);
});

test('rejeita CPFs inválidos', () => {
  assert.equal(cpfValido('529.982.247-24'), false);
  assert.equal(cpfValido('111.111.111-11'), false);
  assert.equal(cpfValido('123'), false);
});

test('formata CPF e telefone enquanto a pessoa digita', () => {
  assert.equal(mascararCpf('5299822'), '529.982.2');
  assert.equal(mascararCpf('52998224725'), '529.982.247-25');
  assert.equal(mascararTelefone('11987654321'), '(11) 98765-4321');
  assert.equal(mascararTelefone('1133334444'), '(11) 3333-4444');
});

test('valida a data de nascimento', () => {
  const hoje = new Date('2026-10-07T12:00:00');
  assert.equal(nascimentoValido('2000-05-10', hoje), true);
  assert.equal(nascimentoValido('2030-01-01', hoje), false);
  assert.equal(nascimentoValido('1850-01-01', hoje), false);
  assert.equal(nascimentoValido('', hoje), false);
});

test('calcula a idade considerando se já fez aniversário', () => {
  const hoje = new Date('2026-10-07T12:00:00');
  assert.equal(calcularIdade('2000-10-07', hoje), 26);
  assert.equal(calcularIdade('2000-10-08', hoje), 25);
});
