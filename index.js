const inputSearch = document.getElementById('search');
const magnifyingGlass = document.getElementById('lupa');

const buttonPrevPage = document.getElementById('prevPage');
const buttonNextPage = document.getElementById('nextPage');

const containerCards = document.querySelector('.container-cards');

const numberPage = document.querySelector('#numberPage');

const footerTop = document.getElementById('top');

let currentPage = 1;

let characters = [];

getCharacters(currentPage);

inputSearch.addEventListener('change', searchCharacter);
magnifyingGlass.addEventListener('click', searchCharacter);

fillFooter();

async function getCharacters(page) {
	try {
		buttonPrevPage.setAttribute('disabled', true);
		buttonNextPage.setAttribute('disabled', true);
		let endpoint = 'https://rickandmortyapi.com/api/character';
		if (page != undefined) endpoint += `?page=${page}`;

		inputSearch.value = '';

		const response = await fetch(`${endpoint}`).then((response) =>
			response.json()
		);

		if (page === 1) {
			buttonPrevPage.setAttribute('disabled', true);
		} else {
			buttonPrevPage.removeAttribute('disabled');
		}

		if (currentPage === 42) {
			buttonNextPage.setAttribute('disabled', true);
		} else {
			buttonNextPage.removeAttribute('disabled');
		}

		characters = response.results;
		numberPage.innerHTML = `${page}/42`;
		containerCards.innerHTML = '';
		for (const character of characters) {
			const lastSeen = await lastEpisode(character);
			const firstWord = character.species.split(' ');
			containerCards.innerHTML += `
						<div class='card'>
							<img id='imageCharacter' src='${character.image}'/>
							<div id='content'>
								<h3>${character.name}</h3>
								<div id='status'>
									<div class='statusColor ${
										character.status == 'Dead'
											? 'dead'
											: character.status == 'Alive'
											? 'alive'
											: 'unknown'
									}'>
									</div>
									<p>${character.status} -</p>
									<p>${firstWord[0]}</p>						
								</div>
								<div id='location'>
									<p>Last known location</p>
									<span>${character.location.name}</span>
								</div>
								<div id='episode'>
									<p>Last seen on</p>
									<span>${lastSeen}</span>
								</div>
							</div>
						</div>
						`;
		}
	} catch (error) {
		console.log('Erro no get!');
	}
}

async function searchCharacter() {
	const filteredCharacters = characters.filter((character) =>
		character.name.toUpperCase().includes(inputSearch.value.toUpperCase())
	);
	containerCards.innerHTML = '';

	for (const character of filteredCharacters) {
		const lastSeen = await lastEpisode(character);
		const firstWord = character.species.split(' ');
		containerCards.innerHTML += `
		<div class='card'>
			<img id='imageCharacter' src='${character.image}'/>
			<div id='content'>
				<h3>${character.name}</h3>
				<div id='status'>
					<div class='statusColor ${
						character.status == 'Dead'
							? 'dead'
							: character.status == 'Alive'
							? 'alive'
							: 'unknown'
					}'>
					</div>
					<p>${character.status} -</p>
					<p>${firstWord[0]}</p>						
				</div>
				<div id='location'>
					<p>Last known location</p>
					<span>${character.location.name}</span>
				</div>
				<div id='episode'>
					<p>Last seen on</p>
					<span>${lastSeen}</span>
				</div>
			</div>
		</div>
		`;
	}
	console.log(characters);
}

async function lastEpisode(character) {
	const ep = character.episode.length - 1;
	try {
		const response = await fetch(`${character.episode[ep]}`).then((value) =>
			value.json()
		);
		return response.name;
	} catch (error) {
		console.log('Erro no Get');
	}
}

async function fillFooter() {
	try {
		const responseCharacters = await fetch(
			'https://rickandmortyapi.com/api/character'
		).then((value) => value.json());
		const responseLocations = await fetch(
			'https://rickandmortyapi.com/api/location'
		).then((value) => value.json());
		const responseEpisodes = await fetch(
			'https://rickandmortyapi.com/api/episode'
		).then((value) => value.json());
		footerTop.innerHTML = `
			<p>Personagens: ${responseCharacters.info.count}</p>
			<p>Localizações: ${responseLocations.info.count}</p>
			<p>Episódios: ${responseEpisodes.info.count}</p>
		`;
	} catch (error) {}
}

const controls = {
	prev() {
		getCharacters(--currentPage);
	},
	next() {
		getCharacters(++currentPage);
	},
};
