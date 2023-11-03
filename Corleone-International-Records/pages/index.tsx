import { Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@nextui-org/react";
import DefaultLayout from "@/layouts/default";
import Image from "next/image";
import { useState } from "react";

export default function IndexPage() {
	const { isOpen: isSongsModalOpen, onOpen: onOpenSongsModal, onOpenChange: onOpenChangeSongsModal } = useDisclosure();
	const { isOpen: isAlbumsModalOpen, onOpen: onOpenAlbumsModal, onOpenChange: onOpenChangeAlbumsModal } = useDisclosure();
	const { isOpen: isArtistModalOpen, onOpen: onOpenArtistModal, onOpenChange: onOpenChangeArtistModal } = useDisclosure();
	const [data, setData] = useState({ songs: null, albums: null, artist: null });


	const fetchData = async (type: string) => {
		try {
			const response = await fetch(`/api/spotify/${type}`);
			const dataResponse = await response.json();
			setData(prevData => ({ ...prevData, [type]: dataResponse }));
			console.log(data);
		} catch (error) {
			console.error(error);
		}
	}

	return (
		<DefaultLayout>
			<section className="w-full bg-pink-500">
				<div className="container px-4 md:px-6">
					<div className="grid gap-6 items-center">
						<div className="flex flex-col justify-center space-y-8 text-center">
							<div className="space-y-2">
								<h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none bg-clip-text text-transparent bg-gradient-to-r from-green-100 to-green-500">
									Corleone International Records
								</h1>
								<div className="flex justify-center">
									<Image src="/Chencho.svg" alt="Chencho" width={420} height={420} />
								</div>
								<p className="max-w-[700px] text-zinc-200 md:text-5xl dark:text-zinc-100 mx-auto">
									En tus pesadillas desde el 45 👺
								</p>
							</div>
							<div className="w-full grid lg:grid-cols-3 max-w-full mx-auto">
								<div className="flex flex-col items-center space-y-2 border-gray-800 p-4 rounded-lg">
									<Button onClick={() => { onOpenSongsModal(); fetchData('songs'); }} color="success">Songs</Button>
									<Modal isOpen={isSongsModalOpen} onOpenChange={onOpenChangeSongsModal}>
										<ModalContent>
											{(onClose) => (
												<>
													<ModalHeader className="flex flex-col gap-1">Top 10 canciones de Chencho Corleone</ModalHeader>
													<ModalBody className="overflow-y-auto max-h-[60vh]">
														{data.songs ? (
															data.songs.tracks.map((song, index) => (
																<div key={index} className="mb-4">
																	<p><strong>Nombre de la Canción:</strong> {song.name}</p>
																	<p><strong>Artista:</strong> {song.artists.map(artist => artist.name).join(', ')}</p>
																	<p><strong>Álbum:</strong> {song.album.name}</p>
																	<p><strong>Fecha de Lanzamiento:</strong> {song.album.release_date}</p>
																	<p><strong>Popularidad:</strong> {song.popularity} (0 a 100)</p>
																	<img src={song.album.images[0]?.url} alt={song.name} width={64} height={64} />
																</div>
															))
														) : (
															<p>Cargando canciones...</p>
														)}
													</ModalBody>
													<ModalFooter>
														<Button color="danger" variant="light" onClick={onClose}>
															Close
														</Button>
													</ModalFooter>
												</>
											)}
										</ModalContent>
									</Modal>


								</div>
								<div className="flex flex-col items-center space-y-2 border-gray-800 p-4 rounded-lg">
									<Button 
									onClick={() => { onOpenAlbumsModal(); fetchData('albums'); }}
									color="success"
									>Albums</Button>
									<Modal isOpen={isAlbumsModalOpen} onOpenChange={onOpenChangeAlbumsModal}>
										<ModalContent>
											{(onClose) => (
												<>
													<ModalHeader className="flex flex-col gap-1">Top 5 Álbumes de feats de Chencho Corleone</ModalHeader>
													<ModalBody className="overflow-y-auto max-h-[60vh]">
														{data.albums ? (
															data.albums.items.map((album, index) => (
																<div key={index} className="mb-4">
																	<p><strong>Nombre del Álbum:</strong> {album.name}</p>
																	<p><strong>Fecha de Lanzamiento:</strong> {album.release_date}</p>
																	<p><strong>Tipo de Álbum:</strong> {album.album_type}</p>
																	<img src={album.images[0]?.url} alt={album.name} width={64} height={64} />
																</div>
															))
														) : (
															<p>Cargando álbumes...</p>
														)}
													</ModalBody>
													<ModalFooter>
														<Button color="danger" variant="light" onClick={onClose}>
															Close
														</Button>
													</ModalFooter>
												</>
											)}
										</ModalContent>
									</Modal>

								</div>
								<div className="flex flex-col items-center space-y-2 border-gray-800 p-4 rounded-lg">
									<Button onClick={() => { onOpenArtistModal(); fetchData('artist'); }} color="success">Artist</Button>
									<Modal isOpen={isArtistModalOpen} onOpenChange={onOpenChangeArtistModal}>
										<ModalContent>
											{(onClose) => (
												<>
													<ModalHeader className="flex flex-col gap-1">Información de Chencho Corleone</ModalHeader>
													<ModalBody>
														{data.artist ? (
															<div className="flex items-center">
																<Image src={data.artist.images?.[0]?.url || "/placeholder-image-url.png"} alt={data.artist.name} width={150} height={150} />
																<div className="ml-4">
																	<p className="font-bold text-xl">{data.artist.name}</p>
																	<p>Seguidores: {data.artist.followers?.total}</p>
																	<p>Géneros: {data.artist.genres?.join(', ')}</p>
																</div>
															</div>
														) : (
															<p>Cargando información del artista...</p>
														)}
													</ModalBody>
													<ModalFooter>
														<Button color="danger" variant="light" onClick={onClose}>
															Close
														</Button>
													</ModalFooter>
												</>
											)}
										</ModalContent>
									</Modal>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>
		</DefaultLayout>
	);
}
