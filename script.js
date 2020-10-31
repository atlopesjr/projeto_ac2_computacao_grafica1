var canvas, engine, scene, camera, sceneToRender;

window.addEventListener('DOMContentLoaded', function() {
    canvas = document.getElementById('renderCanvas');
    engine = new BABYLON.Engine(canvas, true);

    function createScene() {
        //declaração de todas as variáveis
        scene = new BABYLON.Scene(engine);
        var spot = new BABYLON.PointLight("spot", new BABYLON.Vector3(0, 30, 10), scene);
        var camera = new BABYLON.ArcRotateCamera("Camera", -20, 50, 80, BABYLON.Vector3.Zero(), scene);
        var groundMaterial = new BABYLON.StandardMaterial("ground", scene);
        var ground = BABYLON.Mesh.CreateGroundFromHeightMap("ground", "textures/moongray.jpg", 200, 200, 200, 0, 10, scene, false);
        var sun = BABYLON.Mesh.CreateSphere("sun", 1.2, 1.2, scene);
        var particleSystem = new BABYLON.ParticleSystem("particles", 2000, scene);
        var keys = [];
        var animation = new BABYLON.Animation("animation", "position.x", 30, BABYLON.Animation.ANIMATIONTYPE_FLOAT,
                                                                        BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
        var skybox = BABYLON.Mesh.CreateBox("skyBox", 800.0, scene);
        var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
        var spriteManagerPlayer = new BABYLON.SpriteManager("playerManager", "textures/Astronaut.png", 1, {width: 48, height: 48}, scene);
        var player = new BABYLON.Sprite("player", spriteManagerPlayer);

        //função responsáve pela criação da luz e da câmera
        light_and_camera(spot,camera,scene);
        
        //função responsável pela criação do sistema de partículas
        particle_system(particleSystem,sun,scene);
        
        //função responsável pela definição de materiais diversos
        material_definition(groundMaterial,ground,sun,skyboxMaterial,skybox)
        
        //função responsável pelas animações
        animations_set(keys,animation,sun,player,spot,scene)

        return scene;
    }

    function light_and_camera(light,camera,scene){
        //cria a luz da cena
        light.diffuse = new BABYLON.Color3(1, 1, 1);
        light.specular = new BABYLON.Color3(0, 0, 0);
        //cria a camera
        camera.lowerBetaLimit = 0.1;
        camera.upperBetaLimit = (Math.PI / 2) * 0.9;
        camera.lowerRadiusLimit = 30;
        camera.upperRadiusLimit = 150;
        camera.attachControl(canvas, true);
    }

    function particle_system(particleSystem,emitter,scene){
        //Textura de cada partícula
        particleSystem.particleTexture = new BABYLON.Texture("/textures/flare.png", scene);

        // Origem das partículas
        particleSystem.emitter = emitter; // the starting object, the emitter
        particleSystem.minEmitBox = new BABYLON.Vector3(-1, 0, 0); // Starting all from
        particleSystem.maxEmitBox = new BABYLON.Vector3(1, 0, 0); // To...

        // Cor das partículas
        particleSystem.color1 = new BABYLON.Color4(0.7, 0.8, 1.0, 1.0);
        particleSystem.color2 = new BABYLON.Color4(0.2, 0.5, 1.0, 1.0);
        particleSystem.colorDead = new BABYLON.Color4(0, 0, 0.2, 0.0);

        // Tamanho das partículas
        particleSystem.minSize = 0.1;
        particleSystem.maxSize = 0.5;

        //  "Tempo de vida das partículas"
        particleSystem.minLifeTime = 0.3;
        particleSystem.maxLifeTime = 1.5;

        // Taxa de emissão
        particleSystem.emitRate = 1500;

        // Blendmode
        particleSystem.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;

        // Gravidade das partículas
        particleSystem.gravity = new BABYLON.Vector3(0, -9.81, 0);

        // Direção após ser emitida
        particleSystem.direction1 = new BABYLON.Vector3(5, 0, 0);
        particleSystem.direction2 = new BABYLON.Vector3(5, 0, 0);

        // Velocidade angular em radianos
        particleSystem.minAngularSpeed = 0;
        particleSystem.maxAngularSpeed = Math.PI;

        // velocidade
        particleSystem.minEmitPower = 2;
        particleSystem.maxEmitPower = 6;
        particleSystem.updateSpeed = 0.005;

        particleSystem.isLocal = true;
        particleSystem.start();
    }
    
    function material_definition(groundMaterial,ground,sun,skyboxMaterial,skybox){
        // Chão
        groundMaterial.diffuseTexture = new BABYLON.Texture("textures/moon.jpg", scene);
        ground.material = groundMaterial;
    
        //Sol
        sun.material = new BABYLON.StandardMaterial("sun", scene);
        sun.material.emissiveColor = new BABYLON.Color3(1, 1, 1);
    
        // Skybox
        
        skyboxMaterial.backFaceCulling = false;
        skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("textures/skybox", scene);
        skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
        skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
        skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
        skyboxMaterial.disableLighting = true;
        skybox.material = skyboxMaterial;
    }

    function animations_set(keys,animation,sun,player,spot,scene){
        // At the animation key 0, the value of scaling is "1"
        keys.push({
            frame: 0,
            value: 0
        });

        // At the animation key 50, the value of scaling is "0.2"
        keys.push({
            frame: 50,
            value: Math.PI
        });

        // At the animation key 100, the value of scaling is "1"
        keys.push({
            frame: 100,
            value: 0
        });

        // Animação inicial
        animation.setKeys(keys);
        sun.animations.push(animation);
        scene.beginAnimation(sun, 0, 100, true);
    
        //Animação do sol
        scene.registerBeforeRender(function () {
            sun.position = spot.position;
            spot.position.x -= 0.5;
            if (spot.position.x < -90)
                spot.position.x = 100;
        });
    
        player.playAnimation(0, 11, true, 250);
        player.position.y = 6;
        player.size = 3;
    }
    
    scene = createScene();;
    sceneToRender = scene
    
    engine.runRenderLoop(function () {
        if (sceneToRender && sceneToRender.activeCamera) {
            sceneToRender.render();
        }
    });
    
    // Resize
    window.addEventListener("resize", function () {
        engine.resize();
    });
});
