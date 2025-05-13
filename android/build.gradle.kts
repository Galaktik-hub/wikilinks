// Top-level build file where you can add configuration options common to all sub-projects/modules.
import java.util.Properties

// Charge le fichier local.properties
val localPropsFile = rootProject.file("local.properties")
val localProps = Properties().apply {
    if (localPropsFile.exists()) {
        load(localPropsFile.inputStream())
    }
}

// On expose l’objet Properties complet
extra["localProperties"] = localProps

localProps.remove("sdk.dir")

// On expose des entrées
localProps.forEach { key, value ->
    // On cast en String (faire conversion manuellement pour chaque entrée)
    extra[key.toString()] = value
}

plugins {
    alias(libs.plugins.android.application) apply false
}
