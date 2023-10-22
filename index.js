const inputSearch = document.getElementById('search');

const buttonPrevPage = document.getElementById('prevPage');
const buttonNextPage = document.getElementById('nextPage');

const containerCards = document.querySelector('#principal-container');

const numberPage = document.querySelector('#numberPage');

const footerTop = document.getElementById('top');

let currentPage = 1;

let characters = [];

getCharacters(currentPage);

inputSearch.addEventListener('change', searchCharacter);

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
						<div data-bs-toggle="modal" data-bs-target="#exampleModal-${
							character.id
						}" class='card col-lg-3 col-sm-12 d-flex flex-row'>
								<img id='imageCharacter' src='${character.image}'/>
								<div id='content d-flex flex-column'>
									<h3 id='character-name'>${character.name}</h3>
									<div id='status' class='d-flex align-items-center flex-row text-center'>
										<div class='statusColor ${
											character.status == 'Dead'
												? 'dead'
												: character.status == 'Alive'
												? 'alive'
												: 'unknown'
										}'>
										</div>
										<div id='character-status'>${character.status} -</div>
										<div id='character-firstWord'>${firstWord[0]}</div>						
									</div>
									<div id='location'>
										<p id='lastLocation'>Last known location</p>
										<span id='locationName'>${character.location.name}</span>
									</div>
									<div id='episode'>
										<p id='lastSeenOn'>Last seen on</p>
										<span id='lastSeen'>${lastSeen}</span>
									</div>
								</div>
							
						</div>

						<div class="modal fade" id="exampleModal-${
							character.id
						}" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
							<div class="modal-dialog">
								<div class="modal-content">
								<div class="modal-header">
									<h1 class="modal-title fs-5" id="exampleModalLabel">${character.name}</h1>
									<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
								</div>
								<div class="modal-body d-flex justify-content-center align-items-center flex-column">
									<img id='imageCharacterModal' src='${character.image}'/>
									<div id='status-modal' class='d-flex align-items-center flex-row text-center'>
										<div class='statusColor ${
											character.status == 'Dead'
												? 'dead'
												: character.status == 'Alive'
												? 'alive'
												: 'unknown'
										}'>
										</div>
										<div id='character-status'>${character.status} -</div>
										<div id='character-firstWord'>${firstWord[0]}</div>						
									</div>
								<div id='location-modal'>
									<div>Last known location -&nbsp</div>
									<div> ${character.location.name}</div>
								</div>
								</div>
								<div class="modal-footer">
									<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
								</div>
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
		<div class='card col-lg-3 col-sm-12 d-flex flex-row'>
								<img id='imageCharacter' src='${character.image}'/>
								<div id='content d-flex flex-column'>
									<h3 id='character-name'>${character.name}</h3>
									<div id='status' class='d-flex align-items-center flex-row text-center'>
										<div class='statusColor ${
											character.status == 'Dead'
												? 'dead'
												: character.status == 'Alive'
												? 'alive'
												: 'unknown'
										}'>
										</div>
										<div id='character-status'>${character.status} -</div>
										<div id='character-firstWord'>${firstWord[0]}</div>						
									</div>
									<div id='location'>
										<p id='lastLocation'>Last known location</p>
										<span id='locationName'>${character.location.name}</span>
									</div>
									<div id='episode'>
										<p id='lastSeenOn'>Last seen on</p>
										<span id='lastSeen'>${lastSeen}</span>
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
			<a class='underline' target='blank' href='https://rickandmortyapi.com/documentation/#get-all-characters'>Personagens: ${responseCharacters.info.count}</a>
			<a class='underline' target='blank' href='https://rickandmortyapi.com/documentation/#get-all-locations'>Localizações: ${responseLocations.info.count}</a>
			<a class='underline' target='blank' href='https://rickandmortyapi.com/documentation/#get-all-episodes'>Episódios: ${responseEpisodes.info.count}</a>
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
