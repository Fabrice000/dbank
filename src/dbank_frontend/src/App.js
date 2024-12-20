import { html, render } from "lit-html";
import { dbank_backend } from "declarations/dbank_backend";
import logo from "./dbank_logo.png";

class App {
  constructor() {
    this.amount = 0;
    this.#render();
    this.#loading = this.#loading.bind(this); 
    window.addEventListener("load", this.#loading);
    this.#handleSubmit = this.#handleSubmit.bind(this)
    window.addEventListener("submit",this.#handleSubmit)
  }
  #loading = async () => {
    console.log("Loading")
    this.amount = await dbank_backend.checkBalance();
    this.#render();
  };
  #handleSubmit = async (e) => {
    e.preventDefault()
    const button = e.target.querySelector("#submit-btn");
    console.log(button)
    button.setAttribute("disabled",true)
    const inputAmount = parseFloat(document.getElementById("input-amount").value);
    const withdrawalAmount = parseFloat(document.getElementById("withdrawal-amount").value);
    if(document.getElementById("input-amount").value.length != 0){
      await dbank_backend.topUp(inputAmount)

    }
    if(document.getElementById("withdrawal-amount").value.length != 0){
      await dbank_backend.withDraw(withdrawalAmount)

    }
    await dbank_backend.compound()
    this.#loading()
    document.getElementById("input-amount").value = "";
    document.getElementById("withdrawal-amount").value = "";

    button.removeAttribute("disabled")
    }
    #update = async () => {

    }
  #render() {
    let body = html`
      <div class="container">
        <img src=${logo} alt="DBank logo" width="100" />
        <h1>Current Balance: $<span id="value">${Math.round(this.amount*100)/100}</span></h1>
        <div class="divider"></div>
        <form action="#">
          <h2>Amount to Top Up</h2>
          <input
            id="input-amount"
            type="number"
            step="0.01"
            min="0"
            name="topUp"
            value=""
          />
          <h2>Amount to Withdraw</h2>
          <input
            id="withdrawal-amount"
            type="number"
            name="withdraw"
            step="0.01"
            min="0"
            value=""
          />
          <input id="submit-btn" type="submit" value="Finalise Transaction" />
        </form>
      </div>
    `;
    render(body, document.getElementById("root"));
  }
}

export default App;
