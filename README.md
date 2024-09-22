# datebot
In the modern world, too many people struggle with dating, therefore datebot has been created to remove the stress of having too many matches and not knowing what to say to them. datebot saves time for users so that they can increase their conversion rates for going on dates. datebot allows users to connect their tinder accounts along with their openai account to leverage the full powers of AI to secure dates and level up their messaging skills.

# Usage

Navigate and login to the tinder web app https://tinder.com/app and proceed to do the 2FA flow.

Once you have successfully logged in, open the networks tab in your browser and inspect one of the requests to find your "X-AUTH-TOKEN" and "USER-SESSION-ID" which are present in a request header.

Simply input these headers upon logging in.

<img width="816" alt="login" src="https://github.com/AlexParshh/tinderbot/assets/53206800/fec02674-c116-4ab8-a02c-d0c88f04a06d">

Add your OPENAI_API_KEY={KEY} to your .env.local file

Proceed to start generating rizz and sending messages with a click of a button!

# The flow

Firstly, you need to tweak the settings to your liking, this will allow tinderbot to generate applicable messages to your match. Adding your contact information allows it to respond with your number in case the match asks.

<img width="536" alt="settings" src="https://github.com/AlexParshh/tinderbot/assets/53206800/b2d27507-d8ce-4033-922b-d0acc3480198">

Find a match, press generate rizz, and if you like what it generated, you can send it.

Tinderbot will seperate your matches based on whether you have messaged them yet or not. It will attempt to write pick up lines for those that have not been messaged, based on their account information such as biography and interests.

![263770265-b048f557-55ec-4e9b-b591-c4173b79ee85](https://github.com/user-attachments/assets/d745fef4-b377-49c8-b1d3-ad33359a2355)

Here is a full flow example (profile images has been made hidden):

![263770311-0983cf55-09ac-4d1a-b8b1-28bfe8f9e18f](https://github.com/user-attachments/assets/149ea03f-7287-4d2c-8fd9-d43c8346c979)

Upon pressing Send Rizz you will see that the UI updates and the match will get moved to the "messaged" section. 

You can check your mobile tinder app to see that it has in fact been sent:

<img width="428" alt="263770361-7a68a408-bc75-4665-812c-2f577ee32b80" src="https://github.com/user-attachments/assets/fa989226-d9b5-4456-adb7-66a3c9bca7a7">

And now the match will look as follows:

![263770398-e58df381-d80e-4f7e-9479-f9050d08a5ce](https://github.com/user-attachments/assets/9fa7624c-2df4-457c-b2d3-ac8c7fd101e4)


Here is an example of responding to a match that has an exisitng message history, tinderbot will take into account the entire message history for every response, meaning that if you have 100 messages of history, it will know the full context:

![263770446-15545723-fb4b-409e-a810-88dc7033f63f](https://github.com/user-attachments/assets/a3e404a4-00e9-49c2-8249-4d228d514304)


