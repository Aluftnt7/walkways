<template>
  <section class="main-footer">
       <div class="width-container inside-footer-container flex col a-start j-center">
            <router-link to="/">
        <img class="logo" src="../../assets/svg/help.svg" alt="Logo" />
      </router-link>
            <div class="content-container-footer flex col bet">
                <div class="flex a-start col bet logo-location-container">
                    <img src="../../assets/svg/icon-location.svg"/>
                    <p>WalkWays is the world’s leading volunteering platform. We show you how to volunteer abroad! Search & compare the best international volunteer programs offered by volunteer organizations and local NGOs with just a few clicks.</p>
                </div>
                    <div class="phone-email-container flex col around">
                        <div class="flex a-center bet">
                        <img src="../../assets/svg/icon-phone.svg"/>
                            <p>+1-543-123-4567</p>
                        </div>
                        <div class="flex a-center bet">
                        <img src="../../assets/svg/icon-email.svg"/>
                            <p>example@fylo.com</p>
                        </div>
                    </div>
                    <ul>
                          <router-link to="/" class="router-link">
                        <li>Home</li>
                         </router-link>
                         <router-link to="/edit" class="router-link">
                        <li>Publish</li>
                         </router-link>
                         <router-link to="/projs/aroundTheWorld" class="router-link">
                        <li>All Projects</li>
                         </router-link>
                        <li>Blog</li>
                    </ul>
                    <ul>
                        <li>Contact Us</li>
                        <li>Terms</li>
                        <li>Privacy</li>
                    </ul>
                    <div class="link-svg">        
                       <img class="img-svg" src="../../assets/svg/facebook.svg"/>
                       <img class="img-svg" src="../../assets/svg/instegram.svg"/>
                       <img class="img-svg" src="../../assets/svg/linkdin.svg"/>
                    </div>
            </div>
   </div>
  </section>
</template>