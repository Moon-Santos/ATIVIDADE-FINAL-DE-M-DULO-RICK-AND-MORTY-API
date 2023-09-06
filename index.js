const inputSearch = document.getElementById('search');

const buttonPrevPage = document.getElementById('prevPage');
const buttonNextPage = document.getElementById('nextPage');

const containerCards = document.querySelector('.container-cards');

const page = document.querySelector('#numberPage');

let prevPage;
let nextPage;

let numberPage = 0;

let characters = [];

getCharacter();

buttonNextPage.addEventListener('click', getNextPage);

buttonPrevPage.addEventListener('click', getPrevPage);

inputSearch.addEventListener('input', searchCharacter);

async function getCharacter() {
	try {
		const response = await fetch(
			'https://rickandmortyapi.com/api/character'
		).then((response) => response.json());
		characters = response.results;
		nextPage = response.info.next;
		numberPage++;
		page.innerHTML = `${numberPage}/42`;
		containerCards.innerHTML = '';
		characters.forEach((item) => {
			containerCards.innerHTML += `
            <div>${item.name}</div>
            `;
		});
	} catch (error) {
		console.log('Erro no get!');
	}
}

async function getNextPage() {
	try {
		if (!nextPage) {
			return;
		}
		const response = await fetch(`${nextPage}`).then((response) =>
			response.json()
		);
		characters = response.results;
		prevPage = response.info.prev;
		nextPage = response.info.next;
		if (numberPage == 42) {
			return;
		}
		numberPage++;
		page.innerHTML = `${numberPage}/42`;
		containerCards.innerHTML = '';
		characters.forEach((item) => {
			containerCards.innerHTML += `
            <div>${item.name}</div>
            `;
		});
	} catch (error) {
		console.log('Erro no get!');
	}
}

async function getPrevPage() {
	try {
		if (!prevPage) return;
		const response = await fetch(`${prevPage}`).then((response) =>
			response.json()
		);
		characters = response.results;
		prevPage = response.info.prev;
		nextPage = response.info.next;
		numberPage--;
		page.innerHTML = `${numberPage}/42`;
		containerCards.innerHTML = '';
		characters.forEach((item) => {
			containerCards.innerHTML += `
            <div>${item.name}</div>
            `;
		});
	} catch (error) {
		console.log('Erro no get!');
	}
}

function searchCharacter() {
	const filteredCharacters = characters.filter((character) =>
		character.name.toUpperCase().includes(inputSearch.value.toUpperCase())
	);
	containerCards.innerHTML = '';

	filteredCharacters.forEach((item) => {
		containerCards.innerHTML += `
        <div>${item.name}</div>
        `;
	});
	console.log(characters);
}
