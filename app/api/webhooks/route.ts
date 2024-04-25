import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { WebhookEvent } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { use } from 'react'
import { useRadio } from '@nextui-org/react'
 
export async function POST(req: Request) {
 
  // You can find this in the Clerk Dashboard -> Webhooks -> choose the webhook
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET
 
  if (!WEBHOOK_SECRET) {
    throw new Error('Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local')
  }
 
  // Get the headers
  const headerPayload = headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");
 
  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occurred -- no svix headers', {
      status: 400
    })
  }
 
  // Get the body
  const payload = await req.json()
  const body = JSON.stringify(payload);

 
  // Create a new Svix instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET);
 
  let evt: WebhookEvent
 
  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new Response('Error occured', {
      status: 400
    })
  }
 
  // Get the ID and type
  const { id, } = evt.data;
  const eventType = evt.type;

  if(eventType === "user.created"){

    const userData = JSON.parse(body)
    console.log(userData.data.email_addresses)

    
    await db.user.create({
      data:{
        id: userData.data.id,
        name:userData.data.first_name +" " +userData.data.last_name,
        email:userData.data.email_addresses[0].email_address,
        image:userData.data.image_url

      }
    })
  
  }

  if(eventType === "organization.created"){

    const orgData = JSON.parse(body)
    
    await db.organization.create({
      data:{
        id: orgData.data.id,
        title:orgData.data.name,
        image:orgData.data.image_url

      }
    })

    await db.orgusers.create({
      data:{
        userId: orgData.data.created_by,
        orgId: orgData.data.id
      }
    })
  
  }
 

  if (eventType === "organizationInvitation.accepted") {
    const data = JSON.parse(body);
    console.log('invitations body:', data);
    console.log("public Metadata", data.data.public_metadata);
    console.log("private Metadata", data.data.private_metadata);
  
    const user = await db.user.findFirst({
      where: {
        email: data.data.email_address
      }
    });
  
    if (user) {
      const orgId = data.data.organization_id; // Assuming organization ID is stored in public_metadata
  
      
      const organization = await db.organization.findUnique({
        where: {
          id: orgId
        }
      });
  
      if (organization) {
        await db.orgusers.create({
          data: {
            userId: user.id,
            orgId: orgId
          }
        });
      } else {
        console.error(`Organization with ID ${orgId} not found.`);
      }
    } else {
      console.error(`User with email ${data.data.email_address} not found.`);
    }


    const organizationId = "org_2fY9hdJufIneQgIkvMydrPiixT2";

// Query the organization along with its associated users
const organizationWithUsers = await db.organization.findUnique({
  where: {
    id: organizationId
  },
  include: {
    users: true // Include the associated users
  }
});

if (organizationWithUsers) {
  const numberOfUsers = organizationWithUsers.users.length;
  console.log(`Number of users associated with organization ${organizationId}: ${numberOfUsers}`);
} else {
  console.error(`Organization with ID ${organizationId} not found.`);
}


  }








  return new Response('', { status: 200 })
}
 