import { movieSort } from './functions'
import { IMovie } from './models/Movie'
import { getData } from './services/movieService'

const movieContainerID = 'movie-container'

let movies: IMovie[] = [], sort = true

	export const init = () => {
	const form = document.getElementById('searchForm') as HTMLFormElement, sortID = 'sort', sortTag = document.createElement('select')

	Object.assign(sortTag, {
		id: sortID,
		innerHTML: `
		<option value="asc">A-&Ouml;</option>
		<option value="desc">&Ouml;-A</option>
		`
	})

	sortTag.addEventListener('change', (e: Event) => {
		sort = (e.target as HTMLSelectElement).value === 'asc'
		createHtml(movies, Object.assign(document.getElementById(movieContainerID) as HTMLDivElement, {innerHTML: '' }))
	})

	form.addEventListener('submit', (e: SubmitEvent) => {
		e.preventDefault()
		handleSubmit()
	})

	form.append(Object.assign(document.createElement('label'), { htmlFor: sortID, innerHTML: 'Sortera: ' }), sortTag)
}

export async function handleSubmit() {
	let searchText = (document.getElementById('searchText') as HTMLInputElement).value, container = document.getElementById(movieContainerID) as HTMLDivElement

	container.innerHTML = ''

	try {
		movies = await getData(searchText)

		if (movies.length > 0) {
		createHtml(movies, container)
		} else {
		displayNoResult(container)
		}
	} catch {
		displayNoResult(container)
	}
}

export const createHtml = (movies: IMovie[], container: HTMLDivElement) => {
	movieSort(movies, sort)

	movies.forEach(m => {
		const movie = document.createElement('div')

		movie.classList.add('movie')

		movie.append(Object.assign(document.createElement('h3'), { innerHTML: m.Title }), Object.assign(document.createElement('img'), { src: m.Poster, alt: m.Title }))
		container.append(movie)
	})
}

export const displayNoResult = (container: HTMLDivElement) => {
  	container.append(Object.assign(document.createElement('p'), { innerHTML: 'Inga s&ouml;kresultat att visa' }))
}