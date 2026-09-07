package com.bazaarnepal.graphql;

import com.bazaarnepal.domain.User;
import org.springframework.graphql.data.method.annotation.SchemaMapping;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;

@Controller
public class UserFieldResolver {

    private static boolean isOwner(User user, Authentication auth) {
        return auth != null
                && auth.isAuthenticated()
                && user != null
                && user.getId().equals(auth.getName());
    }

    private static boolean isPublic(String visibility) {
        return "public".equalsIgnoreCase(visibility);
    }

    @SchemaMapping(typeName = "User", field = "email")
    public String email(User user, Authentication auth) {
        return isOwner(user, auth) || isPublic(user.getEmailVisibility()) ? user.getEmail() : null;
    }

    @SchemaMapping(typeName = "User", field = "phone")
    public String phone(User user, Authentication auth) {
        return isOwner(user, auth) || isPublic(user.getPhoneVisibility()) ? user.getPhone() : null;
    }

    @SchemaMapping(typeName = "User", field = "whatsapp")
    public String whatsapp(User user, Authentication auth) {
        return isOwner(user, auth) || isPublic(user.getWhatsappVisibility()) ? user.getWhatsapp() : null;
    }
}
