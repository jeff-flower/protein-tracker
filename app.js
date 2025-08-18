const STORAGE_KEY = 'protein-data';
const proteinFormElement = document.getElementsByTagName('form')[0];

render_protein_entries();

proteinFormElement.addEventListener('submit', event => {
  // don't allow form submission for prototype
  event.preventDefault();

  const proteinDateInputElement = document.getElementById('protein-date');
  const proteinNameInputElement = document.getElementById('protein-name');
  const proteinAmountInputElement = document.getElementById('protein-amount');

  const proteinEntry = { 
    date: proteinDateInputElement.value,
    name: proteinNameInputElement.value,
    amount: proteinAmountInputElement.value,
  };

  // Validate date?
  // Check that year is this year or last
  if(isProteinEntryInvalid(proteinEntry)) {
    // show errors 
    return;
  }

  storeProteinEntry(proteinEntry);

  render_protein_entries();

  proteinFormElement.reset();
  
});

function isProteinEntryInvalid(proteinEntry) {
    // TODO
    // missing date, name or amount
    // date for today or in the past
    // warn if more than a week old?
    // amount is negative
    return false;
}

function storeProteinEntry(proteinEntry) {
  const proteinData = get_protein_data();

  proteinData.push(proteinEntry);

  proteinData.sort((a, b) => {
    date_one = new Date(a.date);
    date_two = new Date(b.date);

    return date_one - date_two;
  });

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(proteinData));
}

function get_protein_data() {
  const data = window.localStorage.getItem(STORAGE_KEY);

  const proteinData = data ? JSON.parse(data) : [];

  return proteinData;
}

function render_protein_entries() {
  const protein_entries_container = document.getElementById('past-protein');
  
  const protein_data = get_protein_data();

  if (protein_data.length === 0) {
    return;
  }

  protein_entries_container.textContent =  "";

  protein_entries_container.appendChild(create_protein_header_element());
  protein_entries_container.appendChild(create_protein_list_element(protein_data))
}

function create_protein_header_element() {
  const protein_header = document.createElement("h2");
  protein_header.textContent = "Past protein";

  return protein_header;
}

function create_protein_list_element(protein_data) {
  const protein_list = document.createElement("ul");
  protein_data.forEach((protein_entry) => {
    const protein_list_item = document.createElement("li");
    protein_list_item.textContent = `${protein_entry.date} ${protein_entry.name} ${protein_entry.amount}g`;
    protein_list.appendChild(protein_list_item);
  })

  return protein_list;
}
