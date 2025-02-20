I already had this mostly written, but it was deleted because my browser crashed.  So if this isn't super in depth, just know that I did study and look into this, and genuinely found it interesting.  I just didn't feel like re-writing everything out as thoroughly the second time

## Distributed Denial of Service attacks (DDOS)
I understood the basic idea behind DDOS attacks, but hadn't learned details on how they work or how to mitigate them
- DDOS attacks flood a server on multiple different axis in an attempt to prevent it from functioning as intended.
- I found 3 different layers of attacks:
  - Layer 7:  These are HTTP requests (usually Post and Get)
  - Low and slow attaack:  This makes a connection to the website and sends a very small amount of data over a long period of time.
  - Layer 3-4:  This involves sending UDP packets to the server on a bunch of different ports, which requires the server to handle it by sending back "Invalid port" messages

- I found 4 different ways to handle getting DDOS attacked:
  - Sending requests to a "black hole", which I don't really like because it effectively gives the hacker what he wanted
  - Throttling requests to X amount per minute, which I also don't like, for the same reason as above
  - Using a firewall to help filter out the requests, which I feel like is a good idea, but I'd have to see how effective the firewall is
  - Using an Anycast network which diffuses out the requests to multiple different IP addresses, which allows the different servers to handle the load better

## Cross-Site Scripting (XSS)
I had never heard of Cross-Site Scripting before, so I learned about it from scratch:
- It's an injection type of attack that puts code into the website to be executed by making it look like an HTML element or through other means
- An example:  Putting the following into a comments page: <script>alert('XSS')</script>
- When other users go to that comments page, that alert will pop up on their page.
- This is especially dangerous because when the code is executed on someone else's browser, it uses their browsing data (Cookies, etc)

It seems to me that the best way to prevent this is to use the preexisting tools that purify user input, though that's certainly not the only way to prevent it.

## Cross-Site Request Forgery (CSRF)

This one was really interesting to me, and I had also never heard of it before.  One security feature that I hadn't heard about before that I really appreciated was the Same Origin Policy.  Essentially, it prevents scripts on a website from reading or writing to another website unless they share protocol, port, and domain.  This is a great and necessary security feature for our day to day life on the internet.

However, other websites CAN still hit their endpoints.  And, since cookies are sent with every request regardless of domain, if one website decided to call another website's delete_account endpoint while you're logged in to that other website, it would send those cookies to the other website and run that code, deleting your account by visiting another website.  

This has been largely fixed by the creation of Anti-CSRF tokens which are essentially a type of signature that comes from the server, and is sent out to the application, which authorizes it to make the API calls that the website.  However, those Ati-CSRF tokens need to be unpredictable and secure, otherwise they can be circumvented.
