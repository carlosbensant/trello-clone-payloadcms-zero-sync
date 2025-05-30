import { Payload } from 'payload'

export const seed = async (payload: Payload) => {
  const user = await payload.find({
    collection: 'users',
    limit: 1,
  })

  if (!user.docs.length) {
    console.log('Seed? Yes!')

    const { id: userId } = await payload.create({
      collection: 'users',
      data: {
        username: 'carlos',
        name: 'Carlos Andrés Bensant',
        first_name: 'Carlos',
        last_name: 'Bensant',
        email: 'info@mana.do',
        password: 'test',
        roles: ['admin'],
      },
    })

    const { id: userId2 } = await payload.create({
      collection: 'users',
      data: {
        username: 'emilio',
        name: 'Emilio Hernández',
        first_name: 'Emilio',
        last_name: 'Hernández',
        email: 'emilio@mana.do',
        password: 'test',
        roles: ['user'],
      },
    })

    await payload.create({
      collection: 'pipelines',
      data: {
        title: 'Smarter Services',
        owner: userId,
        members: [userId, userId2],
      },
    })
  }
}
