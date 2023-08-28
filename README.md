# tinderbot
In the modern world, too many people struggle with dating, therefore Tinderbot has been created to remove the stress of having too many matches and not knowing what to say to them. Tinderbot saves time for users so that they can increase their conversion rates for going on dates. Tinderbot allows users who have no "game" or "rizz" to connect their tinder accounts along with their openai account to leverage the full powers of AI to secure dates and level up their messaging skills.

# Usage

Navigate and login to the tinder web app https://tinder.com/app and proceed to do the 2FA flow.

Once you have successfully logged in, open the networks tab in your browser and inspect one of the requests to find your "X-AUTH-TOKEN" and "USER-SESSION-ID" which are present in a request header.

Simply input these headers upon logging in.

<img width="816" alt="login" src="https://github.com/AlexParshh/tinderbot/assets/53206800/a158d77c-676c-41fa-b425-34756b58705a">

Add your OPENAI_API_KEY={KEY} to your .env.local file

Proceed to start generating rizz and sending messages with a click of a button!

# The flow

Firstly, you need to tweak the settings to your liking, this will allow tinderbot to generate applicable messages to your match. Adding your contact information allows it to respond with your number in case the match asks.

<img width="536" alt="settings" src="https://github.com/AlexParshh/tinderbot/assets/53206800/f050bd8b-dd14-48e4-9686-7d0a3a695b65">

Find a match, press generate rizz, and if you like what it generated, you can send it.

Tinderbot will seperate your matches based on whether you have messaged them yet or not. It will attempt to write pick up lines for those that have not been messaged, based on their account information such as biography and interests.

![unmessagedclean](https://github.com/AlexParshh/tinderbot/assets/53206800/486e35fb-6e39-479c-94c2-8c981876d052)

Here is a full flow example:

![singularclean](https://github.com/AlexParshh/tinderbot/assets/53206800/ea8187e3-9828-46e8-a81c-5b0faf54f435)

Upon pressing Send Rizz you will see that the UI updates and the match will get moved to the "messaged" section. 

You can check your mobile tinder app to see that it has in fact been sent:

<img width="428" alt="mobile" src="https://github.com/AlexParshh/tinderbot/assets/53206800/4ea19426-9024-41a0-8b36-440802228439">

And now the match will look as follows:

![singularpostclean](https://github.com/AlexParshh/tinderbot/assets/53206800/803fe635-500c-4b85-82f9-05ae7055af12)

Here is an example of responding to a match that has an exisitng message history, tinderbot will take into account the entire message history for every response, meaning that if you have 100 messages of history, it will know the full context:

![faceclean](https://github.com/AlexParshh/tinderbot/assets/53206800/b3652f5f-353d-4183-818f-77a063fe79d5)

