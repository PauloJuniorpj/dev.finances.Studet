//Fluxo de construção
const Modal = {
  open() {
    document.querySelector('.modal-overlay').classList.add('active')
  },
  close() {
    document.querySelector('.modal-overlay').classList.remove('active')
  }
}

// Guarda os dados no localStorage
const Storage = {
  get() {
    return JSON.parse(localStorage.getItem('finances:transactions')) || []
  },
  set(transactions) {
    localStorage.setItem('finances:transactions', JSON.stringify(transactions))
  }
}

const transactions = [
  {
    description: 'luz',
    amount: -50000,
    date: '23/01/2021'
  },
  { description: 'WebSite', amount: 500000, date: '23/01/2021' },

  { description: 'internet', amount: -20000, date: '23/01/2021' },

  { description: 'app', amount: 20000, date: '23/01/2021' }
]

const Transection = {
  all: Storage.get(),
  add(transaction) {
    Transection.all.push(transaction)

    App.reload()
  },

  remove(index) {
    Transection.all.splice(index, 1)

    App.reload()
  },

  incomes() {
    let income = 0

    Transection.all.forEach(transaction => {
      if (transaction.amount > 0) {
        income += transaction.amount
      }
    })

    return income
  },
  expenses() {
    let expense = 0
    Transection.all.forEach(transaction => {
      if (transaction.amount < 0) {
        expense += transaction.amount
      }
    })

    return expense
  },
  total() {
    return Transection.incomes() + Transection.expenses()
  }
}

const DOM = {
  transactionsContainer: document.querySelector('#data-table tbody'),

  addTransaction(transaction, index) {
    const tr = document.createElement('tr')
    tr.innerHTML = DOM.innerHTMLTransaction(transaction, index)
    tr.dataset.index = index

    DOM.transactionsContainer.appendChild(tr)
  },

  innerHTMLTransaction(transaction, index) {
    const CSSclass = transaction.amount > 0 ? 'income' : 'expense'

    //Formatação do dinheiro
    const amount = Utils.formatCurrency(transaction.amount)

    const html = `
      <td class="description">${transaction.description}</td>
      <td class="${CSSclass}">${amount}</td>
      <td class="date">${transaction.date}</td>
      <td>
      <img onclick="Transection.remove(${index})" src="assets/minus.svg" alt="" >
      </td>
    
    `
    return html
  },

  updateBalance() {
    document.getElementById('incomeDisplay').innerHTML = Utils.formatCurrency(
      Transection.incomes()
    )

    document.getElementById('expenseDisplay').innerHTML = Utils.formatCurrency(
      Transection.expenses()
    )

    document.getElementById('totalDisplay').innerHTML = Utils.formatCurrency(
      Transection.total()
    )
  },

  clearTransactions() {
    DOM.transactionsContainer.innerHTML = ''
  }
}

//Funçao da formatação
const Utils = {
  formatAmount(value) {
    value = Number(value) * 100

    return amount
  },

  formatDate(date) {
    const splittedDate = date.split('-')
    return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`
  },

  formatCurrency(value) {
    const signal = Number(value) < 0 ? '-' : ''
    value = String(value).replace(/\D/g, '')

    value = Number(value) / 100

    value = value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    })

    return signal + value
  }
}

const Form = {
  description: document.querySelector('input#description'),
  amount: document.querySelector('input#amount'),
  date: document.querySelector('input#date'),

  getValues() {
    return {
      description: Form.description.value,
      amount: Form.amount.value,
      date: Form.date.value
    }
  },

  validateField() {
    const { description, amount, date } = Form.getValues()

    if (
      description.trim() === '' ||
      amount.trim() === '' ||
      date.trim() === ''
    ) {
      throw new Error('Por favor, preencha todos os campos')
    }
  },

  formatValues() {
    let { description, amount, date } = Form.getValues()

    amount = Utils.formatAmount(amount)

    date = Utils.formatDate(date)

    return {
      description,
      amount,
      date
    }
  },

  clearFields() {
    Form.description.value = ''
    Form.amount.value = ''
    Form.date.value = ''
  },

  submit(event) {
    event.preventDefault()

    try {
      const transaction = Form.validateField()

      //Salvar
      transaction.add(transaction)

      //Apagar os dados do formulario
      Form.clearFields()

      //Fecha modal
      Modal.close()
    } catch (error) {
      alert(error.message)
    }
  }
}

//Fluxo de execução
const App = {
  init() {
    Transection.all.forEach((transaction, index) => {
      DOM.addTransaction(transaction, index)
    })

    DOM.updateBalance()

    Storage.set(Transection)
  },
  reload() {
    DOM.clearTransactions()
    App.init()
  }
}

App.init()
