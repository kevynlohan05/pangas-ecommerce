import state from "./state.js";
import { byId } from "./utils.js";
import { renderCart } from "./cart.js";

const dlgCheckout = byId("dlgCheckout");
const formCheckout = byId("formCheckout");
const btnCheckout = byId("btnCheckout");
const elCep = byId("cep");
const elRua = byId("rua");
const elNumero = byId("numero");
const elBairro = byId("bairro");
const elCidade = byId("cidade");
const elUF = byId("uf");
const closeCheckoutBtn = byId("closeCheckout");

let elMensagemCEP = byId("cep-message") || document.createElement("span");
if (!elMensagemCEP.id) {
  elMensagemCEP.id = "cep-message";
  elMensagemCEP.className = "text-red-600 text-sm";
  elCep.insertAdjacentElement("afterend", elMensagemCEP);
}

function setCepMessage(msg) {
  elMensagemCEP.textContent = msg;
}

function formatCep(value) {
  value = value.replace(/\D/g, '');
  if (value.length > 5) value = value.replace(/^(\d{5})(\d)/, '$1-$2');
  return value;
}

async function buscarCep(cep) {
  try {
    const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
    if (!res.ok) throw new Error("Falha de rede");
    const data = await res.json();
    if (data.erro) {
      setCepMessage("❌ CEP não encontrado. Preencha manualmente.");
      return false;
    }
    elRua.value = data.logradouro || "";
    elBairro.value = data.bairro || "";
    elCidade.value = data.localidade || "";
    elUF.value = data.uf || "";
    setCepMessage("");
    return true;
  } catch {
    setCepMessage("❌ Não foi possível buscar o CEP. Preencha manualmente.");
    return false;
  }
}

elCep.addEventListener("blur", async (e) => {
  const cepLimpo = e.target.value.replace(/\D/g, '');
  if (cepLimpo.length === 8) await buscarCep(cepLimpo);
  else if (cepLimpo.length > 0) setCepMessage("❌ CEP deve ter 8 dígitos.");
  else setCepMessage("");
});

elCep.addEventListener("input", (e) => {
  e.target.value = formatCep(e.target.value);
  setCepMessage("");
});

btnCheckout.addEventListener("click", () => {
  dlgCheckout.showModal();
});

closeCheckoutBtn.addEventListener("click", () => dlgCheckout.close());

formCheckout.addEventListener("submit", async (e) => {
  e.preventDefault();

  const cepLimpo = elCep.value.replace(/\D/g, '');
  if (cepLimpo.length === 8) {
    const ok = await buscarCep(cepLimpo);
    if (!ok) return;
  } else {
    setCepMessage("❌ CEP inválido.");
    return;
  }

  alert("Compra finalizada com sucesso!");
  state.cart.clear();
  renderCart();
  dlgCheckout.close();
});

export function initCheckout() {}
