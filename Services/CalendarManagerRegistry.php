<?php

/**
 * Created by PhpStorm.
 * User: Albert
 * Date: 23/2/2016
 * Time: 8:52
 */
namespace fadosProduccions\fullCalendarBundle\Services;

use Doctrine\Common\Persistence\ManagerRegistry;
use Symfony\Component\DependencyInjection\ContainerInterface as Container;
use Doctrine\ORM\EntityManager;

class CalendarManagerRegistry
{
    protected $managerRegistry;
    protected $container;
    protected $recipient;
    protected $manager;

    public function __construct(ManagerRegistry $managerRegistry, Container $container)
    {
        $this->container = $container;
        $this->recipient = $this->container->getParameter( 'class_manager' );
        $this->managerRegistry = $managerRegistry;
        $this->manager = $this->managerRegistry->getManagerForClass($this->recipient);

    }

    public function getManager() {
        return $this->manager;
    }

    public function getEvents($dataFrom,$dataTo) {
        $qb = $this->manager->createQueryBuilder()
            ->select('c')
            ->from($this->recipient, 'c')
            ->where('c.startDatetime BETWEEN :firstDate AND :lastDate')
            ->setParameter('firstDate', $dataFrom)
            ->setParameter('lastDate', $dataTo)
        ;

        return $qb->getQuery()->getResult();
    }

    public function changeDate($newStartData,$newEndData,$id) {
        $entity = $this->manager->getRepository($this->recipient)->find($id);
        $entity->setStartDatetime(new \DateTime($newStartData));
        $entity->setEndDatetime(new \DateTime($newEndData));
        $this->save($entity);
   }

    public function resizeEvent($newDate,$id) {
        $entity = $this->manager->getRepository($this->recipient)->find($id);
        $entity->setEndDatetime(new \DateTime($newDate));
        $this->save($entity);
   }

    public function serialize($elements) {
        $result = [];
        foreach ($elements as $element) {
            $result[] = $element->toArray();
        }
        return json_encode($result);
    }

    public function save($entity) {
        $this->manager->persist($entity);
        $this->manager->flush();
    }


}