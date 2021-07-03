import {GetStaticProps} from 'next';
import Image from 'next/image'
import { format, parseISO } from "date-fns"
import ptBR  from "date-fns/locale/pt-BR"
import { convertDurationToTimeString } from "../utils/convertDuration"
import { api } from '../services/api'

import styles from './home.module.scss'


type Episode = {
  id: string;
  title: string;
  thumbnail: string;
  description: string;
  members: string;
  duration: number;
  durationAsString: number;
  url: string;
  publishedAt: string;

}
type HomeProps = {
  lastestEpisodes: Array<Episode>
  allEpisodes: Array<Episode>
}


export default function Home({ lastestEpisodes, allEpisodes }: HomeProps) {
  return (
    <div className={styles.homepage}>
      <section className={styles.lastestEpisodes}>
          <h2>Últimos lançamentos</h2>

          <ul>
              {lastestEpisodes.map(episode => {
                return (
                  <li key={episode.id}>
                    <Image 
                    width={192} 
                    height={192} 
                    src={episode.thumbnail} 
                    alt={episode.title} 
                    objectFit='cover'
                    />

                    <div className={styles.episodesDetails}>
                        <a href="">{episode.title}</a>
                        <p>{episode.members}</p>
                        <span>{episode.publishedAt}</span>
                        <span>{episode.durationAsString}</span>
                    </div>
                    <button type="button">
                      <img src="/play-green.svg" alt="" />
                    </button>
                  </li>
                )
              })}
          </ul>
      </section>

      <section className={styles.allEpisodes}>
              <h2>Todos episódios</h2>

              <table cellSpacing={0}>
                  <thead>
                    <th></th>
                    <th>Podcast</th>
                    <th>Integrantes</th>
                    <th>Data</th>
                    <th>Duração</th>
                    <th></th>
                  </thead>

                  <tbody>
                      {allEpisodes.map(episode => {
                        return (
                          <tr key={episode.id}>
                            <td>
                              <Image 
                              width={120}
                              height={120}
                              src={episode.thumbnail}
                              alt={episode.title}
                              objectFit="cover"
                              />
                            </td>
                              <td>
                                <a href="">{episode.title}</a>
                              </td>
                              <td>{episode.members}</td>
                              <td>{episode.publishedAt}</td>
                              <td>{episode.durationAsString}</td>
                              <td>
                                <button type="button">
                                  <img src="/play-green.svg" alt="" />
                                </button>
                              </td>
                          </tr>
                        )
                      })}
                  </tbody>
              </table>
      </section>
    </div>

  )
}
export const getStaticProps: GetStaticProps = async () => {
  const { data } = await api.get('episodes', {
    params: {
      _limit: 12,
      _sort: 'publised_at',
      _order: 'desc',
    }
  })
 



const episodes = data.map(episode => {
  return {
    id: episode.id,
    title: episode.title,
    thumbnail: episode.thumbnail,
    members: episode.members,
    publishedAt: format(parseISO(episode.pusblished_at), 'd MMM yy', {locale: ptBR}),
    duration: Number(episode.file.duration),
    durationAsString: convertDurationToTimeString(Number(episode.file.duration)),
    description: episode.description,
    url: episode.file.url,
  };
  
}) 

const lastestEpisodes = episodes.slice(0, 2);
const allEpisodes = episodes.slice(2, episodes.length)

  return {
    props: {
      lastestEpisodes,
      allEpisodes,
    },
    revalidate: 60 * 60 * 8,
  }
}
